package tests

import (
	"fmt"
	"sync"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark-crypto/ecc/bn254"
	"github.com/consensys/gnark-crypto/ecc/bn254/fp"
	"github.com/consensys/gnark-crypto/ecc/bn254/fr"

	"github.com/ingonyama-zk/icicle/v2/wrappers/golang/core"
	cr "github.com/ingonyama-zk/icicle/v2/wrappers/golang/cuda_runtime"
	icicleBn254 "github.com/ingonyama-zk/icicle/v2/wrappers/golang/curves/bn254"
	"github.com/ingonyama-zk/icicle/v2/wrappers/golang/curves/bn254/msm"
)

func projectiveToGnarkAffine(p icicleBn254.Projective) bn254.G1Affine {
	px, _ := fp.LittleEndian.Element((*[fp.Bytes]byte)((&p.X).ToBytesLittleEndian()))
	py, _ := fp.LittleEndian.Element((*[fp.Bytes]byte)((&p.Y).ToBytesLittleEndian()))
	pz, _ := fp.LittleEndian.Element((*[fp.Bytes]byte)((&p.Z).ToBytesLittleEndian()))

	zInv := new(fp.Element)
	x := new(fp.Element)
	y := new(fp.Element)

	zInv.Inverse(&pz)

	x.Mul(&px, zInv)
	y.Mul(&py, zInv)

	return bn254.G1Affine{X: *x, Y: *y}
}

func testAgainstGnarkCryptoMsm(scalars core.HostSlice[icicleBn254.ScalarField], points core.HostSlice[icicleBn254.Affine], out icicleBn254.Projective) bool {
	scalarsFr := make([]fr.Element, len(scalars))
	for i, v := range scalars {
		slice64, _ := fr.LittleEndian.Element((*[fr.Bytes]byte)(v.ToBytesLittleEndian()))
		scalarsFr[i] = slice64
	}

	pointsFp := make([]bn254.G1Affine, len(points))
	for i, v := range points {
		pointsFp[i] = projectiveToGnarkAffine(v.ToProjective())
	}

	return testAgainstGnarkCryptoMsmGnarkCryptoTypes(scalarsFr, pointsFp, out)
}

func testAgainstGnarkCryptoMsmGnarkCryptoTypes(scalarsFr core.HostSlice[fr.Element], pointsFp core.HostSlice[bn254.G1Affine], out icicleBn254.Projective) bool {
	var msmRes bn254.G1Jac
	msmRes.MultiExp(pointsFp, scalarsFr, ecc.MultiExpConfig{})

	var icicleResAsJac bn254.G1Jac
	proj := projectiveToGnarkAffine(out)
	icicleResAsJac.FromAffine(&proj)

	return msmRes.Equal(&icicleResAsJac)
}

func convertIcicleAffineToG1Affine(iciclePoints []icicleBn254.Affine) []bn254.G1Affine {
	points := make([]bn254.G1Affine, len(iciclePoints))
	for index, iciclePoint := range iciclePoints {
		xBytes := ([fp.Bytes]byte)(iciclePoint.X.ToBytesLittleEndian())
		fpXElem, _ := fp.LittleEndian.Element(&xBytes)

		yBytes := ([fp.Bytes]byte)(iciclePoint.Y.ToBytesLittleEndian())
		fpYElem, _ := fp.LittleEndian.Element(&yBytes)
		points[index] = bn254.G1Affine{
			X: fpXElem,
			Y: fpYElem,
		}
	}

	return points
}

func TestMSM(t *testing.T) {
	cfg := msm.GetDefaultMSMConfig()
	cfg.IsAsync = true
	for _, power := range []int{2, 3, 4, 5, 6, 7, 8, 10, 18} {
		size := 1 << power

		scalars := icicleBn254.GenerateScalars(size)
		points := icicleBn254.GenerateAffinePoints(size)

		stream, _ := cr.CreateStream()
		var p icicleBn254.Projective
		var out core.DeviceSlice
		_, e := out.MallocAsync(p.Size(), p.Size(), stream)
		assert.Equal(t, e, cr.CudaSuccess, "Allocating bytes on device for Projective results failed")
		cfg.Ctx.Stream = &stream

		e = msm.Msm(scalars, points, &cfg, out)
		assert.Equal(t, e, cr.CudaSuccess, "Msm failed")
		outHost := make(core.HostSlice[icicleBn254.Projective], 1)
		outHost.CopyFromDeviceAsync(&out, stream)
		out.FreeAsync(stream)

		cr.SynchronizeStream(&stream)
		// Check with gnark-crypto
		assert.True(t, testAgainstGnarkCryptoMsm(scalars, points, outHost[0]))

	}
}

func TestMSMPinnedHostMemory(t *testing.T) {
	cfg := msm.GetDefaultMSMConfig()
	for _, power := range []int{10} {
		size := 1 << power

		scalars := icicleBn254.GenerateScalars(size)
		points := icicleBn254.GenerateAffinePoints(size)

		pinnable := cr.GetDeviceAttribute(cr.CudaDevAttrHostRegisterSupported, 0)
		lockable := cr.GetDeviceAttribute(cr.CudaDevAttrPageableMemoryAccessUsesHostPageTables, 0)

		pinnableAndLockable := pinnable == 1 && lockable == 0

		var pinnedPoints core.HostSlice[icicleBn254.Affine]
		if pinnableAndLockable {
			points.Pin(cr.CudaHostRegisterDefault)
			pinnedPoints, _ = points.AllocPinned(cr.CudaHostAllocDefault)
			assert.Equal(t, points, pinnedPoints, "Allocating newly pinned memory resulted in bad points")
		}

		var p icicleBn254.Projective
		var out core.DeviceSlice
		_, e := out.Malloc(p.Size(), p.Size())
		assert.Equal(t, e, cr.CudaSuccess, "Allocating bytes on device for Projective results failed")
		outHost := make(core.HostSlice[icicleBn254.Projective], 1)

		e = msm.Msm(scalars, points, &cfg, out)
		assert.Equal(t, e, cr.CudaSuccess, "Msm allocated pinned host mem failed")

		outHost.CopyFromDevice(&out)
		// Check with gnark-crypto
		assert.True(t, testAgainstGnarkCryptoMsm(scalars, points, outHost[0]))

		if pinnableAndLockable {
			e = msm.Msm(scalars, pinnedPoints, &cfg, out)
			assert.Equal(t, e, cr.CudaSuccess, "Msm registered pinned host mem failed")

			outHost.CopyFromDevice(&out)
			// Check with gnark-crypto
			assert.True(t, testAgainstGnarkCryptoMsm(scalars, pinnedPoints, outHost[0]))

		}

		out.Free()

		if pinnableAndLockable {
			points.Unpin()
			pinnedPoints.FreePinned()
		}
	}
}
func TestMSMGnarkCryptoTypes(t *testing.T) {
	cfg := msm.GetDefaultMSMConfig()
	for _, power := range []int{3} {
		size := 1 << power

		scalars := make([]fr.Element, size)
		var x fr.Element
		for i := 0; i < size; i++ {
			x.SetRandom()
			scalars[i] = x
		}
		scalarsHost := (core.HostSlice[fr.Element])(scalars)
		points := icicleBn254.GenerateAffinePoints(size)
		pointsGnark := convertIcicleAffineToG1Affine(points)
		pointsHost := (core.HostSlice[bn254.G1Affine])(pointsGnark)

		var p icicleBn254.Projective
		var out core.DeviceSlice
		_, e := out.Malloc(p.Size(), p.Size())
		assert.Equal(t, e, cr.CudaSuccess, "Allocating bytes on device for Projective results failed")
		cfg.ArePointsMontgomeryForm = true
		cfg.AreScalarsMontgomeryForm = true

		e = msm.Msm(scalarsHost, pointsHost, &cfg, out)
		assert.Equal(t, e, cr.CudaSuccess, "Msm failed")
		outHost := make(core.HostSlice[icicleBn254.Projective], 1)
		outHost.CopyFromDevice(&out)
		out.Free()

		// Check with gnark-crypto
		assert.True(t, testAgainstGnarkCryptoMsmGnarkCryptoTypes(scalarsHost, pointsHost, outHost[0]))
	}
}

func TestMSMBatch(t *testing.T) {
	cfg := msm.GetDefaultMSMConfig()
	for _, power := range []int{10, 16} {
		for _, batchSize := range []int{1, 3, 16} {
			size := 1 << power
			totalSize := size * batchSize
			scalars := icicleBn254.GenerateScalars(totalSize)
			points := icicleBn254.GenerateAffinePoints(totalSize)

			var p icicleBn254.Projective
			var out core.DeviceSlice
			_, e := out.Malloc(batchSize*p.Size(), p.Size())
			assert.Equal(t, e, cr.CudaSuccess, "Allocating bytes on device for Projective results failed")

			e = msm.Msm(scalars, points, &cfg, out)
			assert.Equal(t, e, cr.CudaSuccess, "Msm failed")
			outHost := make(core.HostSlice[icicleBn254.Projective], batchSize)
			outHost.CopyFromDevice(&out)
			out.Free()
			// Check with gnark-crypto
			for i := 0; i < batchSize; i++ {
				scalarsSlice := scalars[i*size : (i+1)*size]
				pointsSlice := points[i*size : (i+1)*size]
				out := outHost[i]
				assert.True(t, testAgainstGnarkCryptoMsm(scalarsSlice, pointsSlice, out))
			}
		}
	}
}

func TestPrecomputePoints(t *testing.T) {
	cfg := msm.GetDefaultMSMConfig()
	const precomputeFactor = 8
	cfg.PrecomputeFactor = precomputeFactor

	for _, power := range []int{10, 16} {
		for _, batchSize := range []int{1, 3, 16} {
			size := 1 << power
			totalSize := size * batchSize
			scalars := icicleBn254.GenerateScalars(totalSize)
			points := icicleBn254.GenerateAffinePoints(totalSize)

			var precomputeOut core.DeviceSlice
			_, e := precomputeOut.Malloc(points[0].Size()*points.Len()*int(precomputeFactor), points[0].Size())
			assert.Equal(t, cr.CudaSuccess, e, "Allocating bytes on device for PrecomputeBases results failed")

			e = msm.PrecomputePoints(points, size, &cfg, precomputeOut)
			assert.Equal(t, cr.CudaSuccess, e, "PrecomputeBases failed")

			var p icicleBn254.Projective
			var out core.DeviceSlice
			_, e = out.Malloc(batchSize*p.Size(), p.Size())
			assert.Equal(t, cr.CudaSuccess, e, "Allocating bytes on device for Projective results failed")

			e = msm.Msm(scalars, precomputeOut, &cfg, out)
			assert.Equal(t, cr.CudaSuccess, e, "Msm failed")
			outHost := make(core.HostSlice[icicleBn254.Projective], batchSize)
			outHost.CopyFromDevice(&out)
			out.Free()
			precomputeOut.Free()
			// Check with gnark-crypto
			for i := 0; i < batchSize; i++ {
				scalarsSlice := scalars[i*size : (i+1)*size]
				pointsSlice := points[i*size : (i+1)*size]
				out := outHost[i]
				assert.True(t, testAgainstGnarkCryptoMsm(scalarsSlice, pointsSlice, out))
			}
		}
	}
}

func TestMSMSkewedDistribution(t *testing.T) {
	cfg := msm.GetDefaultMSMConfig()
	for _, power := range []int{2, 3, 4, 5, 6, 7, 8, 10, 18} {
		size := 1 << power

		scalars := icicleBn254.GenerateScalars(size)
		for i := size / 4; i < size; i++ {
			scalars[i].One()
		}
		points := icicleBn254.GenerateAffinePoints(size)
		for i := 0; i < size/4; i++ {
			points[i].Zero()
		}

		var p icicleBn254.Projective
		var out core.DeviceSlice
		_, e := out.Malloc(p.Size(), p.Size())
		assert.Equal(t, e, cr.CudaSuccess, "Allocating bytes on device for Projective results failed")

		e = msm.Msm(scalars, points, &cfg, out)
		assert.Equal(t, e, cr.CudaSuccess, "Msm failed")
		outHost := make(core.HostSlice[icicleBn254.Projective], 1)
		outHost.CopyFromDevice(&out)
		out.Free()
		// Check with gnark-crypto
		assert.True(t, testAgainstGnarkCryptoMsm(scalars, points, outHost[0]))
	}
}

func TestMSMMultiDevice(t *testing.T) {
	numDevices, _ := cr.GetDeviceCount()
	fmt.Println("There are ", numDevices, " devices available")
	wg := sync.WaitGroup{}

	for i := 0; i < numDevices; i++ {
		wg.Add(1)
		cr.RunOnDevice(i, func(args ...any) {
			defer wg.Done()
			cfg := msm.GetDefaultMSMConfig()
			cfg.IsAsync = true
			for _, power := range []int{2, 3, 4, 5, 6, 7, 8, 10, 18} {
				size := 1 << power
				scalars := icicleBn254.GenerateScalars(size)
				points := icicleBn254.GenerateAffinePoints(size)

				stream, _ := cr.CreateStream()
				var p icicleBn254.Projective
				var out core.DeviceSlice
				_, e := out.MallocAsync(p.Size(), p.Size(), stream)
				assert.Equal(t, e, cr.CudaSuccess, "Allocating bytes on device for Projective results failed")
				cfg.Ctx.Stream = &stream

				e = msm.Msm(scalars, points, &cfg, out)
				assert.Equal(t, e, cr.CudaSuccess, "Msm failed")
				outHost := make(core.HostSlice[icicleBn254.Projective], 1)
				outHost.CopyFromDeviceAsync(&out, stream)
				out.FreeAsync(stream)

				cr.SynchronizeStream(&stream)
				// Check with gnark-crypto
				assert.True(t, testAgainstGnarkCryptoMsm(scalars, points, outHost[0]))
			}
		})
	}
	wg.Wait()
}
