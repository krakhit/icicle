"use strict";(self.webpackChunkicicle_docs=self.webpackChunkicicle_docs||[]).push([[3194],{8777:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>s,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"icicle/golang-bindings/multi-gpu","title":"Multi GPU APIs","description":"To learn more about the theory of Multi GPU programming refer to this part of documentation.","source":"@site/versioned_docs/version-3.0.0/icicle/golang-bindings/multi-gpu.md","sourceDirName":"icicle/golang-bindings","slug":"/icicle/golang-bindings/multi-gpu","permalink":"/3.0.0/icicle/golang-bindings/multi-gpu","draft":false,"unlisted":false,"editUrl":"https://github.com/ingonyama-zk/icicle/tree/main/docs/versioned_docs/version-3.0.0/icicle/golang-bindings/multi-gpu.md","tags":[],"version":"3.0.0","lastUpdatedBy":"Yuval Shekel","lastUpdatedAt":1733500431000,"frontMatter":{},"sidebar":"GettingStartedSidebar","previous":{"title":"Vector operations","permalink":"/3.0.0/icicle/golang-bindings/vec-ops"},"next":{"title":"Rust bindings","permalink":"/3.0.0/icicle/rust-bindings"}}');var c=t(4848),r=t(8453);const s={},o="Multi GPU APIs",a={},d=[{value:"A Multi GPU example",id:"a-multi-gpu-example",level:2},{value:"Device Management API",id:"device-management-api",level:2},{value:"<code>RunOnDevice</code>",id:"runondevice",level:3},{value:"<code>SetDevice</code>",id:"setdevice",level:3},{value:"<code>GetDeviceCount</code>",id:"getdevicecount",level:3},{value:"<code>GetActiveDevice</code>",id:"getactivedevice",level:3}];function l(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n.header,{children:(0,c.jsx)(n.h1,{id:"multi-gpu-apis",children:"Multi GPU APIs"})}),"\n",(0,c.jsxs)(n.p,{children:["To learn more about the theory of Multi GPU programming refer to ",(0,c.jsx)(n.a,{href:"/3.0.0/icicle/multi-device",children:"this part"})," of documentation."]}),"\n",(0,c.jsxs)(n.p,{children:["Here we will cover the core multi GPU apis and an ",(0,c.jsx)(n.a,{href:"#a-multi-gpu-example",children:"example"})]}),"\n",(0,c.jsx)(n.h2,{id:"a-multi-gpu-example",children:"A Multi GPU example"}),"\n",(0,c.jsx)(n.p,{children:"In this example we will display how you can"}),"\n",(0,c.jsxs)(n.ol,{children:["\n",(0,c.jsx)(n.li,{children:"Fetch the number of devices installed on a machine"}),"\n",(0,c.jsx)(n.li,{children:"For every GPU launch a thread and set an active device per thread."}),"\n",(0,c.jsx)(n.li,{children:"Execute a MSM on each GPU"}),"\n"]}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-go",children:'package main\n\nimport (\n\t"fmt"\n\t"sync"\n\n\t"github.com/ingonyama-zk/icicle/v3/wrappers/golang/core"\n\tbn254 "github.com/ingonyama-zk/icicle/v3/wrappers/golang/curves/bn254"\n\t"github.com/ingonyama-zk/icicle/v3/wrappers/golang/curves/bn254/msm"\n\t"github.com/ingonyama-zk/icicle/v3/wrappers/golang/runtime"\n)\n\nfunc main() {\n\t// Load backend using env path\n\truntime.LoadBackendFromEnvOrDefault()\n\n\tdevice := runtime.CreateDevice("CUDA", 0)\n\terr := runtime.SetDevice(&device)\n\tnumDevices, _ := runtime.GetDeviceCount()\n\tfmt.Println("There are ", numDevices, " devices available")\n\n\tif err != runtime.Success {\n\t\tpanic(err)\n\t}\n\twg := sync.WaitGroup{}\n\n\tfor i := 0; i < numDevices; i++ {\n\t\tinternalDevice := runtime.Device{DeviceType: device.DeviceType, Id: int32(i)}\n\t\twg.Add(1)\n\t\truntime.RunOnDevice(&internalDevice, func(args ...any) {\n\t\t\tdefer wg.Done()\n\t\t\tcurrentDevice, err := runtime.GetActiveDevice()\n\t\t\tif err != runtime.Success {\n\t\t\t\tpanic("Failed to get current device")\n\t\t\t}\n\n\t\t\tfmt.Println("Running on ", currentDevice.GetDeviceType(), " ", currentDevice.Id, " device")\n\n\t\t\tcfg := msm.GetDefaultMSMConfig()\n\t\t\tcfg.IsAsync = true\n\t\t\tsize := 1 << 10\n\t\t\tscalars := bn254.GenerateScalars(size)\n\t\t\tpoints := bn254.GenerateAffinePoints(size)\n\n\t\t\tstream, _ := runtime.CreateStream()\n\t\t\tvar p bn254.Projective\n\t\t\tvar out core.DeviceSlice\n\t\t\t_, err = out.MallocAsync(p.Size(), 1, stream)\n\t\t\tif err != runtime.Success {\n\t\t\t\tpanic("Allocating bytes on device for Projective results failed")\n\t\t\t}\n\t\t\tcfg.StreamHandle = stream\n\n\t\t\terr = msm.Msm(scalars, points, &cfg, out)\n\t\t\tif err != runtime.Success {\n\t\t\t\tpanic("Msm failed")\n\t\t\t}\n\t\t\toutHost := make(core.HostSlice[bn254.Projective], 1)\n\t\t\toutHost.CopyFromDeviceAsync(&out, stream)\n\t\t\tout.FreeAsync(stream)\n\n\t\t\truntime.SynchronizeStream(stream)\n\t\t\truntime.DestroyStream(stream)\n\t\t\t// Check with gnark-crypto\n\t\t})\n\t}\n\twg.Wait()\n}\n'})}),"\n",(0,c.jsxs)(n.p,{children:["This example demonstrates a basic pattern for distributing tasks across multiple GPUs. The ",(0,c.jsx)(n.code,{children:"RunOnDevice"})," function ensures that each goroutine is executed on its designated GPU and a corresponding thread."]}),"\n",(0,c.jsx)(n.h2,{id:"device-management-api",children:"Device Management API"}),"\n",(0,c.jsxs)(n.p,{children:["To streamline device management we offer as part of ",(0,c.jsx)(n.code,{children:"runtime"})," package methods for dealing with devices."]}),"\n",(0,c.jsx)(n.h3,{id:"runondevice",children:(0,c.jsx)(n.code,{children:"RunOnDevice"})}),"\n",(0,c.jsx)(n.p,{children:"Runs a given function on a specific GPU device, ensuring that all CUDA calls within the function are executed on the selected device."}),"\n",(0,c.jsx)(n.p,{children:"In Go, most concurrency can be done via Goroutines. However, there is no guarantee that a goroutine stays on a specific host thread."}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:"RunOnDevice"})," was designed to solve this caveat and ensure that the goroutine will stay on a specific host thread."]}),"\n",(0,c.jsxs)(n.p,{children:[(0,c.jsx)(n.code,{children:"RunOnDevice"})," locks a goroutine into a specific host thread, sets a current GPU device, runs a provided function, and unlocks the goroutine from the host thread after the provided function finishes."]}),"\n",(0,c.jsx)(n.p,{children:"While the goroutine is locked to the host thread, the Go runtime will not assign other goroutines to that host thread."}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Parameters:"})}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"device *Device"})}),": A pointer to the ",(0,c.jsx)(n.code,{children:"Device"})," instance to be used to run code."]}),"\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"funcToRun func(args ...any)"})}),": The function to be executed on the specified device."]}),"\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"args ...any"})}),": Arguments to be passed to ",(0,c.jsx)(n.code,{children:"funcToRun"}),"."]}),"\n"]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Behavior:"})}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:["The function ",(0,c.jsx)(n.code,{children:"funcToRun"})," is executed in a new goroutine that is locked to a specific OS thread to ensure that all CUDA calls within the function target the specified device."]}),"\n"]}),"\n",(0,c.jsx)(n.admonition,{type:"note",children:(0,c.jsxs)(n.p,{children:["Any goroutines launched within ",(0,c.jsx)(n.code,{children:"funcToRun"})," are not automatically bound to the same GPU device. If necessary, ",(0,c.jsx)(n.code,{children:"RunOnDevice"})," should be called again within such goroutines with the same ",(0,c.jsx)(n.code,{children:"deviceId"}),"."]})}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Example:"})}),"\n",(0,c.jsx)(n.pre,{children:(0,c.jsx)(n.code,{className:"language-go",children:'device := runtime.CreateDevice("CUDA", 0)\nRunOnDevice(&device, func(args ...any) {\n\tfmt.Println("This runs on GPU 0")\n\t// CUDA-related operations here will target GPU 0\n}, nil)\n'})}),"\n",(0,c.jsx)(n.h3,{id:"setdevice",children:(0,c.jsx)(n.code,{children:"SetDevice"})}),"\n",(0,c.jsx)(n.p,{children:"Sets the active device for the current host thread. All subsequent calls made from this thread will target the specified device."}),"\n",(0,c.jsx)(n.admonition,{type:"warning",children:(0,c.jsxs)(n.p,{children:["This function should not be used directly in conjunction with goroutines. If you want to run multi-gpu scenarios with goroutines you should use ",(0,c.jsx)(n.a,{href:"#runondevice",children:"RunOnDevice"})]})}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Parameters:"})}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"device *Device"})}),": A pointer to the ",(0,c.jsx)(n.code,{children:"Device"})," instance to be used to run code."]}),"\n"]}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Returns:"})}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"EIcicleError"})}),": A ",(0,c.jsx)(n.code,{children:"runtime.EIcicleError"})," value, which will be ",(0,c.jsx)(n.code,{children:"runtime.Success"})," if the operation was successful, or an error if something went wrong."]}),"\n"]}),"\n",(0,c.jsx)(n.h3,{id:"getdevicecount",children:(0,c.jsx)(n.code,{children:"GetDeviceCount"})}),"\n",(0,c.jsx)(n.p,{children:"Retrieves the number of devices available on the host."}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Returns:"})}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"(int, EIcicleError)"})}),": The number of devices and an error code indicating the success or failure of the operation."]}),"\n"]}),"\n",(0,c.jsx)(n.h3,{id:"getactivedevice",children:(0,c.jsx)(n.code,{children:"GetActiveDevice"})}),"\n",(0,c.jsx)(n.p,{children:"Gets the device of the currently active device for the calling host thread."}),"\n",(0,c.jsx)(n.p,{children:(0,c.jsx)(n.strong,{children:"Returns:"})}),"\n",(0,c.jsxs)(n.ul,{children:["\n",(0,c.jsxs)(n.li,{children:[(0,c.jsx)(n.strong,{children:(0,c.jsx)(n.code,{children:"(*Device, EIcicleError)"})}),": The device pointer and an error code indicating the success or failure of the operation."]}),"\n"]}),"\n",(0,c.jsxs)(n.p,{children:["This documentation should provide a clear understanding of how to effectively manage multiple GPUs in Go applications using CUDA and other backends, with a particular emphasis on the ",(0,c.jsx)(n.code,{children:"RunOnDevice"})," function for executing tasks on specific GPUs."]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,c.jsx)(n,{...e,children:(0,c.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>o});var i=t(6540);const c={},r=i.createContext(c);function s(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:s(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);