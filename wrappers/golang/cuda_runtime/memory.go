package cuda_runtime

// #cgo CFLAGS: -I /usr/local/cuda/include
// #cgo LDFLAGS: -L/usr/local/cuda/lib64 -lcudart
/*
#include <cuda.h>
#include <cuda_runtime.h>
*/
import "C"

import (
	// "runtime"
	"unsafe"
)

type MemPool = CudaMemPool

func Malloc(size uint) (unsafe.Pointer, CudaError) {
	if size == 0 {
		return nil, CudaErrorMemoryAllocation
	}

	var p C.void
	devicePtr := unsafe.Pointer(&p)
	cSize := (C.size_t)(size)

	ret := C.cudaMalloc(&devicePtr, cSize)
	err := (CudaError)(ret)

	return devicePtr, err
}

func MallocAsync(size uint, stream CudaStream) (unsafe.Pointer, CudaError) {
	if size == 0 {
		return nil, CudaErrorMemoryAllocation
	}

	var p C.void
	devicePtr := unsafe.Pointer(&p)
	cSize := (C.size_t)(size)
	cStream := (C.cudaStream_t)(stream)

	ret := C.cudaMallocAsync(&devicePtr, cSize, cStream)
	err := (CudaError)(ret)

	return devicePtr, err
}

func Free(devicePtr unsafe.Pointer) CudaError {
	ret := C.cudaFree(devicePtr)
	err := (CudaError)(ret)
	return err
}

func FreeAsync(devicePtr unsafe.Pointer, stream Stream) CudaError {
	cStream := (C.cudaStream_t)(stream)
	ret := C.cudaFreeAsync(devicePtr, cStream)
	err := (CudaError)(ret)
	return err
}

func AllocPinned(size int, flags AllocPinnedFlags) (unsafe.Pointer, CudaError) {
	cSize := (C.size_t)(size)
	var hostPtr unsafe.Pointer
	ret := C.cudaHostAlloc(&hostPtr, cSize, flags)
	err := (CudaError)(ret)
	if err != CudaSuccess {
		return nil, err
	}

	return hostPtr, CudaSuccess
}

func GetHostFlags(ptr unsafe.Pointer) (flag uint) {
	cFlag := (C.uint)(flag)
	C.cudaHostGetFlags(&cFlag, ptr)
	return
}

func FreeAllocPinned(hostPtr unsafe.Pointer) CudaError {
	return (CudaError)(C.cudaFreeHost(hostPtr))
}

func RegisterPinned(hostPtr unsafe.Pointer, size int, flags RegisterPinnedFlags) (unsafe.Pointer, CudaError) {
	cSize := (C.size_t)(size)
	// This is required since there are greater values of RegisterPinnedFlags which we do not support currently
	flags = flags & 3
	ret := C.cudaHostRegister(hostPtr, cSize, flags)
	err := (CudaError)(ret)
	if err != CudaSuccess {
		return nil, err
	}

	return hostPtr, CudaSuccess
}

func FreeRegisteredPinned(hostPtr unsafe.Pointer) CudaError {
	return (CudaError)(C.cudaHostUnregister(hostPtr))
}

func CopyFromDevice(hostDst, deviceSrc unsafe.Pointer, size uint) (unsafe.Pointer, CudaError) {
	cCount := (C.size_t)(size)
	ret := C.cudaMemcpy(hostDst, deviceSrc, cCount, uint32(CudaMemcpyDeviceToHost))
	err := (CudaError)(ret)
	return hostDst, err
}

func CopyFromDeviceAsync(hostDst, deviceSrc unsafe.Pointer, size uint, stream CudaStream) CudaError {
	cSize := (C.size_t)(size)
	cStream := (C.cudaStream_t)(stream)
	ret := C.cudaMemcpyAsync(hostDst, deviceSrc, cSize, uint32(CudaMemcpyDeviceToHost), cStream)
	err := (CudaError)(ret)
	return err
}

func CopyToDevice(deviceDst, hostSrc unsafe.Pointer, size uint) (unsafe.Pointer, CudaError) {
	cSize := (C.size_t)(size)
	ret := C.cudaMemcpy(deviceDst, hostSrc, cSize, uint32(CudaMemcpyHostToDevice))
	err := (CudaError)(ret)
	return deviceDst, err
}

func CopyToDeviceAsync(deviceDst, hostSrc unsafe.Pointer, size uint, stream CudaStream) CudaError {
	cCount := (C.size_t)(size)
	cStream := (C.cudaStream_t)(stream)
	ret := C.cudaMemcpyAsync(deviceDst, hostSrc, cCount, uint32(CudaMemcpyHostToDevice), cStream)
	err := (CudaError)(ret)
	return err
}
