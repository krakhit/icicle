"use strict";(self.webpackChunkdocusaurus=self.webpackChunkdocusaurus||[]).push([[2540],{5680:(e,n,t)=>{t.d(n,{xA:()=>u,yg:()=>m});var i=t(6540);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,i,a=function(e,n){if(null==e)return{};var t,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=i.createContext({}),s=function(e){var n=i.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=s(e.components);return i.createElement(l.Provider,{value:n},e.children)},g="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},d=i.forwardRef((function(e,n){var t=e.components,a=e.mdxType,r=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),g=s(t),d=a,m=g["".concat(l,".").concat(d)]||g[d]||p[d]||r;return t?i.createElement(m,o(o({ref:n},u),{},{components:t})):i.createElement(m,o({ref:n},u))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var r=t.length,o=new Array(r);o[0]=d;var c={};for(var l in n)hasOwnProperty.call(n,l)&&(c[l]=n[l]);c.originalType=e,c[g]="string"==typeof e?e:a,o[1]=c;for(var s=2;s<r;s++)o[s]=t[s];return i.createElement.apply(null,o)}return i.createElement.apply(null,t)}d.displayName="MDXCreateElement"},9882:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>c,toc:()=>s});var i=t(8168),a=(t(6540),t(5680));t(1873);const r={},o="Multi GPU APIs",c={unversionedId:"icicle/golang-bindings/multi-gpu",id:"icicle/golang-bindings/multi-gpu",title:"Multi GPU APIs",description:"To learn more about the theory of Multi GPU programming refer to this part of documentation.",source:"@site/docs/icicle/golang-bindings/multi-gpu.md",sourceDirName:"icicle/golang-bindings",slug:"/icicle/golang-bindings/multi-gpu",permalink:"/icicle/golang-bindings/multi-gpu",editUrl:"https://github.com/ingonyama-zk/icicle/tree/main/docs/icicle/golang-bindings/multi-gpu.md",tags:[],version:"current",lastUpdatedBy:"release-bot",lastUpdatedAt:1730815021,formattedLastUpdatedAt:"11/5/2024",frontMatter:{},sidebar:"GettingStartedSidebar",previous:{title:"Vector Operations",permalink:"/icicle/golang-bindings/vec-ops"},next:{title:"ICICLE Hashing in Golang",permalink:"/icicle/golang-bindings/hash"}},l={},s=[{value:"A Multi GPU example",id:"a-multi-gpu-example",level:2},{value:"Device Management API",id:"device-management-api",level:2},{value:"<code>RunOnDevice</code>",id:"runondevice",level:3},{value:"<code>SetDevice</code>",id:"setdevice",level:3},{value:"<code>GetDeviceCount</code>",id:"getdevicecount",level:3},{value:"<code>GetActiveDevice</code>",id:"getactivedevice",level:3}],u={toc:s},g="wrapper";function p(e){let{components:n,...t}=e;return(0,a.yg)(g,(0,i.A)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"multi-gpu-apis"},"Multi GPU APIs"),(0,a.yg)("p",null,"To learn more about the theory of Multi GPU programming refer to ",(0,a.yg)("a",{parentName:"p",href:"/icicle/multi-device"},"this part")," of documentation."),(0,a.yg)("p",null,"Here we will cover the core multi GPU apis and an ",(0,a.yg)("a",{parentName:"p",href:"#a-multi-gpu-example"},"example")),(0,a.yg)("h2",{id:"a-multi-gpu-example"},"A Multi GPU example"),(0,a.yg)("p",null,"In this example we will display how you can"),(0,a.yg)("ol",null,(0,a.yg)("li",{parentName:"ol"},"Fetch the number of devices installed on a machine"),(0,a.yg)("li",{parentName:"ol"},"For every GPU launch a thread and set an active device per thread."),(0,a.yg)("li",{parentName:"ol"},"Execute a MSM on each GPU")),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-go"},'package main\n\nimport (\n    "fmt"\n    "sync"\n\n    "github.com/ingonyama-zk/icicle/v3/wrappers/golang/core"\n    bn254 "github.com/ingonyama-zk/icicle/v3/wrappers/golang/curves/bn254"\n    "github.com/ingonyama-zk/icicle/v3/wrappers/golang/curves/bn254/msm"\n    "github.com/ingonyama-zk/icicle/v3/wrappers/golang/runtime"\n)\n\nfunc main() {\n    // Load backend using env path\n    runtime.LoadBackendFromEnvOrDefault()\n\n    device := runtime.CreateDevice("CUDA", 0)\n    err := runtime.SetDevice(&device)\n    numDevices, _ := runtime.GetDeviceCount()\n    fmt.Println("There are ", numDevices, " devices available")\n\n    if err != runtime.Success {\n        panic(err)\n    }\n    wg := sync.WaitGroup{}\n\n    for i := 0; i < numDevices; i++ {\n        internalDevice := runtime.Device{DeviceType: device.DeviceType, Id: int32(i)}\n        wg.Add(1)\n        runtime.RunOnDevice(&internalDevice, func(args ...any) {\n            defer wg.Done()\n            currentDevice, err := runtime.GetActiveDevice()\n            if err != runtime.Success {\n                panic("Failed to get current device")\n            }\n\n            fmt.Println("Running on ", currentDevice.GetDeviceType(), " ", currentDevice.Id, " device")\n\n            cfg := msm.GetDefaultMSMConfig()\n            cfg.IsAsync = true\n            size := 1 << 10\n            scalars := bn254.GenerateScalars(size)\n            points := bn254.GenerateAffinePoints(size)\n\n            stream, _ := runtime.CreateStream()\n            var p bn254.Projective\n            var out core.DeviceSlice\n            _, err = out.MallocAsync(p.Size(), 1, stream)\n            if err != runtime.Success {\n                panic("Allocating bytes on device for Projective results failed")\n            }\n            cfg.StreamHandle = stream\n\n            err = msm.Msm(scalars, points, &cfg, out)\n            if err != runtime.Success {\n                panic("Msm failed")\n            }\n            outHost := make(core.HostSlice[bn254.Projective], 1)\n            outHost.CopyFromDeviceAsync(&out, stream)\n            out.FreeAsync(stream)\n\n            runtime.SynchronizeStream(stream)\n            runtime.DestroyStream(stream)\n            // Check with gnark-crypto\n        })\n    }\n    wg.Wait()\n}\n')),(0,a.yg)("p",null,"This example demonstrates a basic pattern for distributing tasks across multiple GPUs. The ",(0,a.yg)("inlineCode",{parentName:"p"},"RunOnDevice")," function ensures that each goroutine is executed on its designated GPU and a corresponding thread."),(0,a.yg)("h2",{id:"device-management-api"},"Device Management API"),(0,a.yg)("p",null,"To streamline device management we offer as part of ",(0,a.yg)("inlineCode",{parentName:"p"},"runtime")," package methods for dealing with devices."),(0,a.yg)("h3",{id:"runondevice"},(0,a.yg)("inlineCode",{parentName:"h3"},"RunOnDevice")),(0,a.yg)("p",null,"Runs a given function on a specific GPU device, ensuring that all CUDA calls within the function are executed on the selected device."),(0,a.yg)("p",null,"In Go, most concurrency can be done via Goroutines. However, there is no guarantee that a goroutine stays on a specific host thread."),(0,a.yg)("p",null,(0,a.yg)("inlineCode",{parentName:"p"},"RunOnDevice")," was designed to solve this caveat and ensure that the goroutine will stay on a specific host thread."),(0,a.yg)("p",null,(0,a.yg)("inlineCode",{parentName:"p"},"RunOnDevice")," locks a goroutine into a specific host thread, sets a current GPU device, runs a provided function, and unlocks the goroutine from the host thread after the provided function finishes."),(0,a.yg)("p",null,"While the goroutine is locked to the host thread, the Go runtime will not assign other goroutines to that host thread."),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Parameters:")),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"device *Device")),": A pointer to the ",(0,a.yg)("inlineCode",{parentName:"li"},"Device")," instance to be used to run code."),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"funcToRun func(args ...any)")),": The function to be executed on the specified device."),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"args ...any")),": Arguments to be passed to ",(0,a.yg)("inlineCode",{parentName:"li"},"funcToRun"),".")),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Behavior:")),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"The function ",(0,a.yg)("inlineCode",{parentName:"li"},"funcToRun")," is executed in a new goroutine that is locked to a specific OS thread to ensure that all CUDA calls within the function target the specified device.")),(0,a.yg)("div",{className:"admonition admonition-note alert alert--secondary"},(0,a.yg)("div",{parentName:"div",className:"admonition-heading"},(0,a.yg)("h5",{parentName:"div"},(0,a.yg)("span",{parentName:"h5",className:"admonition-icon"},(0,a.yg)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,a.yg)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,a.yg)("div",{parentName:"div",className:"admonition-content"},(0,a.yg)("p",{parentName:"div"},"Any goroutines launched within ",(0,a.yg)("inlineCode",{parentName:"p"},"funcToRun")," are not automatically bound to the same GPU device. If necessary, ",(0,a.yg)("inlineCode",{parentName:"p"},"RunOnDevice")," should be called again within such goroutines with the same ",(0,a.yg)("inlineCode",{parentName:"p"},"deviceId"),"."))),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Example:")),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-go"},'device := runtime.CreateDevice("CUDA", 0)\nRunOnDevice(&device, func(args ...any) {\n    fmt.Println("This runs on GPU 0")\n    // CUDA-related operations here will target GPU 0\n}, nil)\n')),(0,a.yg)("h3",{id:"setdevice"},(0,a.yg)("inlineCode",{parentName:"h3"},"SetDevice")),(0,a.yg)("p",null,"Sets the active device for the current host thread. All subsequent calls made from this thread will target the specified device."),(0,a.yg)("div",{className:"admonition admonition-warning alert alert--danger"},(0,a.yg)("div",{parentName:"div",className:"admonition-heading"},(0,a.yg)("h5",{parentName:"div"},(0,a.yg)("span",{parentName:"h5",className:"admonition-icon"},(0,a.yg)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.yg)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,a.yg)("div",{parentName:"div",className:"admonition-content"},(0,a.yg)("p",{parentName:"div"},"This function should not be used directly in conjunction with goroutines. If you want to run multi-gpu scenarios with goroutines you should use ",(0,a.yg)("a",{parentName:"p",href:"#runondevice"},"RunOnDevice")))),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Parameters:")),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"device *Device")),": A pointer to the ",(0,a.yg)("inlineCode",{parentName:"li"},"Device")," instance to be used to run code.")),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Returns:")),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"EIcicleError")),": A ",(0,a.yg)("inlineCode",{parentName:"li"},"runtime.EIcicleError")," value, which will be ",(0,a.yg)("inlineCode",{parentName:"li"},"runtime.Success")," if the operation was successful, or an error if something went wrong.")),(0,a.yg)("h3",{id:"getdevicecount"},(0,a.yg)("inlineCode",{parentName:"h3"},"GetDeviceCount")),(0,a.yg)("p",null,"Retrieves the number of devices available on the host."),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Returns:")),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"(int, EIcicleError)")),": The number of devices and an error code indicating the success or failure of the operation.")),(0,a.yg)("h3",{id:"getactivedevice"},(0,a.yg)("inlineCode",{parentName:"h3"},"GetActiveDevice")),(0,a.yg)("p",null,"Gets the device of the currently active device for the calling host thread."),(0,a.yg)("p",null,(0,a.yg)("strong",{parentName:"p"},"Returns:")),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("strong",{parentName:"li"},(0,a.yg)("inlineCode",{parentName:"strong"},"(*Device, EIcicleError)")),": The device pointer and an error code indicating the success or failure of the operation.")),(0,a.yg)("p",null,"This documentation should provide a clear understanding of how to effectively manage multiple GPUs in Go applications using CUDA and other backends, with a particular emphasis on the ",(0,a.yg)("inlineCode",{parentName:"p"},"RunOnDevice")," function for executing tasks on specific GPUs."))}p.isMDXComponent=!0},1873:(e,n,t)=>{t(6540)}}]);