"use strict";(self.webpackChunkicicle_docs=self.webpackChunkicicle_docs||[]).push([[4419],{5817:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>d,metadata:()=>c,toc:()=>o});const c=JSON.parse('{"id":"icicle/rust-bindings/multi-gpu","title":"Multi GPU APIs","description":"TODO update for V3","source":"@site/versioned_docs/version-3.2.0/icicle/rust-bindings/multi-gpu.md","sourceDirName":"icicle/rust-bindings","slug":"/icicle/rust-bindings/multi-gpu","permalink":"/icicle/rust-bindings/multi-gpu","draft":false,"unlisted":false,"editUrl":"https://github.com/ingonyama-zk/icicle/tree/main/docs/versioned_docs/version-3.2.0/icicle/rust-bindings/multi-gpu.md","tags":[],"version":"3.2.0","lastUpdatedBy":"Yuval Shekel","lastUpdatedAt":1733500431000,"frontMatter":{}}');var s=n(4848),t=n(8453);const d={},r="Multi GPU APIs",l={},o=[{value:"A Multi GPU example",id:"a-multi-gpu-example",level:2},{value:"Device management API",id:"device-management-api",level:2},{value:"<code>set_device</code>",id:"set_device",level:4},{value:"<code>get_device_count</code>",id:"get_device_count",level:4},{value:"<code>get_device</code>",id:"get_device",level:4},{value:"Device context API",id:"device-context-api",level:2},{value:"<code>DeviceContext</code>",id:"devicecontext",level:4},{value:"Fields",id:"fields",level:5},{value:"Implementation Notes",id:"implementation-notes",level:5},{value:"<code>DeviceContext::default_for_device(device_id: usize) -&gt; DeviceContext&lt;&#39;static&gt;</code>",id:"devicecontextdefault_for_devicedevice_id-usize---devicecontextstatic",level:4},{value:"Returns",id:"returns",level:4},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns-1",level:4},{value:"<code>check_device(device_id: i32)</code>",id:"check_devicedevice_id-i32",level:4},{value:"Parameters",id:"parameters-1",level:4},{value:"Behavior",id:"behavior",level:4},{value:"Example",id:"example",level:4}];function a(e){const i={a:"a",code:"code",h1:"h1",h2:"h2",h4:"h4",h5:"h5",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.header,{children:(0,s.jsx)(i.h1,{id:"multi-gpu-apis",children:"Multi GPU APIs"})}),"\n",(0,s.jsx)(i.p,{children:"TODO update for V3"}),"\n",(0,s.jsxs)(i.p,{children:["To learn more about the theory of Multi GPU programming refer to ",(0,s.jsx)(i.a,{href:"/icicle/multi-device",children:"this part"})," of documentation."]}),"\n",(0,s.jsxs)(i.p,{children:["Here we will cover the core multi GPU apis and a ",(0,s.jsx)(i.a,{href:"#a-multi-gpu-example",children:"example"})]}),"\n",(0,s.jsx)(i.h2,{id:"a-multi-gpu-example",children:"A Multi GPU example"}),"\n",(0,s.jsx)(i.p,{children:"In this example we will display how you can"}),"\n",(0,s.jsxs)(i.ol,{children:["\n",(0,s.jsx)(i.li,{children:"Fetch the number of devices installed on a machine"}),"\n",(0,s.jsx)(i.li,{children:"For every GPU launch a thread and set an active device per thread."}),"\n",(0,s.jsx)(i.li,{children:"Execute a MSM on each GPU"}),"\n"]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-rust",children:"\n...\n\nlet device_count = get_device_count().unwrap();\n\n(0..device_count)\n        .into_par_iter()\n        .for_each(move |device_id| {\n          set_device(device_id).unwrap();\n\n          // you can allocate points and scalars_d here\n\n          let mut cfg = MSMConfig::default_for_device(device_id);\n          cfg.ctx.stream = &stream;\n          cfg.is_async = true;\n          cfg.are_scalars_montgomery_form = true;\n          msm(&scalars_d, &HostOrDeviceSlice::on_host(points), &cfg, &mut msm_results).unwrap();\n\n          // collect and process results\n        })\n\n...\n"})}),"\n",(0,s.jsxs)(i.p,{children:["We use ",(0,s.jsx)(i.code,{children:"get_device_count"})," to fetch the number of connected devices, device IDs will be ",(0,s.jsx)(i.code,{children:"0, 1, 2, ..., device_count - 1"})]}),"\n",(0,s.jsxs)(i.p,{children:[(0,s.jsx)(i.a,{href:"https://docs.rs/rayon/latest/rayon/iter/trait.IntoParallelIterator.html#tymethod.into_par_iter",children:(0,s.jsx)(i.code,{children:"into_par_iter"})})," is a parallel iterator, you should expect it to launch a thread for every iteration."]}),"\n",(0,s.jsxs)(i.p,{children:["We then call ",(0,s.jsx)(i.code,{children:"set_device(device_id).unwrap();"})," it should set the context of that thread to the selected ",(0,s.jsx)(i.code,{children:"device_id"}),"."]}),"\n",(0,s.jsxs)(i.p,{children:["Any data you now allocate from the context of this thread will be linked to the ",(0,s.jsx)(i.code,{children:"device_id"}),". We create our ",(0,s.jsx)(i.code,{children:"MSMConfig"})," with the selected device ID ",(0,s.jsx)(i.code,{children:"let mut cfg = MSMConfig::default_for_device(device_id);"}),", behind the scene this will create for us a ",(0,s.jsx)(i.code,{children:"DeviceContext"})," configured for that specific GPU."]}),"\n",(0,s.jsxs)(i.p,{children:["We finally call our ",(0,s.jsx)(i.code,{children:"msm"})," method."]}),"\n",(0,s.jsx)(i.h2,{id:"device-management-api",children:"Device management API"}),"\n",(0,s.jsxs)(i.p,{children:["To streamline device management we offer as part of ",(0,s.jsx)(i.code,{children:"icicle-cuda-runtime"})," package methods for dealing with devices."]}),"\n",(0,s.jsx)(i.h4,{id:"set_device",children:(0,s.jsx)(i.a,{href:"https://github.com/ingonyama-zk/icicle/blob/e6035698b5e54632f2c44e600391352ccc11cad4/wrappers/rust/icicle-cuda-runtime/src/device.rs#L6",children:(0,s.jsx)(i.code,{children:"set_device"})})}),"\n",(0,s.jsxs)(i.p,{children:["Sets the current CUDA device by its ID, when calling ",(0,s.jsx)(i.code,{children:"set_device"})," it will set the current thread to a CUDA device."]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Parameters:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"device_id: usize"})}),": The ID of the device to set as the current device. Device IDs start from 0."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Returns:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"CudaResult<()>"})}),": An empty result indicating success if the device is set successfully. In case of failure, returns a ",(0,s.jsx)(i.code,{children:"CudaError"}),"."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Errors:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["Returns a ",(0,s.jsx)(i.code,{children:"CudaError"})," if the specified device ID is invalid or if a CUDA-related error occurs during the operation."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Example:"})}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-rust",children:'let device_id = 0; // Device ID to set\nmatch set_device(device_id) {\n    Ok(()) => println!("Device set successfully."),\n    Err(e) => eprintln!("Failed to set device: {:?}", e),\n}\n'})}),"\n",(0,s.jsx)(i.h4,{id:"get_device_count",children:(0,s.jsx)(i.a,{href:"https://github.com/ingonyama-zk/icicle/blob/e6035698b5e54632f2c44e600391352ccc11cad4/wrappers/rust/icicle-cuda-runtime/src/device.rs#L10",children:(0,s.jsx)(i.code,{children:"get_device_count"})})}),"\n",(0,s.jsx)(i.p,{children:"Retrieves the number of CUDA devices available on the machine."}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Returns:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"CudaResult<usize>"})}),": The number of available CUDA devices. On success, contains the count of CUDA devices. On failure, returns a ",(0,s.jsx)(i.code,{children:"CudaError"}),"."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Errors:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["Returns a ",(0,s.jsx)(i.code,{children:"CudaError"})," if a CUDA-related error occurs during the retrieval of the device count."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Example:"})}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-rust",children:'match get_device_count() {\n    Ok(count) => println!("Number of devices available: {}", count),\n    Err(e) => eprintln!("Failed to get device count: {:?}", e),\n}\n'})}),"\n",(0,s.jsx)(i.h4,{id:"get_device",children:(0,s.jsx)(i.a,{href:"https://github.com/ingonyama-zk/icicle/blob/e6035698b5e54632f2c44e600391352ccc11cad4/wrappers/rust/icicle-cuda-runtime/src/device.rs#L15",children:(0,s.jsx)(i.code,{children:"get_device"})})}),"\n",(0,s.jsx)(i.p,{children:"Retrieves the ID of the current CUDA device."}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Returns:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"CudaResult<usize>"})}),": The ID of the current CUDA device. On success, contains the device ID. On failure, returns a ",(0,s.jsx)(i.code,{children:"CudaError"}),"."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Errors:"})}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["Returns a ",(0,s.jsx)(i.code,{children:"CudaError"})," if a CUDA-related error occurs during the retrieval of the current device ID."]}),"\n"]}),"\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:"Example:"})}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-rust",children:'match get_device() {\n    Ok(device_id) => println!("Current device ID: {}", device_id),\n    Err(e) => eprintln!("Failed to get current device: {:?}", e),\n}\n'})}),"\n",(0,s.jsx)(i.h2,{id:"device-context-api",children:"Device context API"}),"\n",(0,s.jsxs)(i.p,{children:["The ",(0,s.jsx)(i.code,{children:"DeviceContext"})," is embedded into ",(0,s.jsx)(i.code,{children:"NTTConfig"}),", ",(0,s.jsx)(i.code,{children:"MSMConfig"})," and ",(0,s.jsx)(i.code,{children:"PoseidonConfig"}),", meaning you can simply pass a ",(0,s.jsx)(i.code,{children:"device_id"})," to your existing config and the same computation will be triggered on a different device."]}),"\n",(0,s.jsx)(i.h4,{id:"devicecontext",children:(0,s.jsx)(i.a,{href:"https://github.com/ingonyama-zk/icicle/blob/e6035698b5e54632f2c44e600391352ccc11cad4/wrappers/rust/icicle-cuda-runtime/src/device_context.rs#L11",children:(0,s.jsx)(i.code,{children:"DeviceContext"})})}),"\n",(0,s.jsxs)(i.p,{children:["Represents the configuration a CUDA device, encapsulating the device's stream, ID, and memory pool. The default device is always ",(0,s.jsx)(i.code,{children:"0"}),"."]}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-rust",children:"pub struct DeviceContext<'a> {\n    pub stream: &'a CudaStream,\n    pub device_id: usize,\n    pub mempool: CudaMemPool,\n}\n"})}),"\n",(0,s.jsx)(i.h5,{id:"fields",children:"Fields"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"stream: &'a CudaStream"})})}),"\n",(0,s.jsxs)(i.p,{children:["A reference to a ",(0,s.jsx)(i.code,{children:"CudaStream"}),". This stream is used for executing CUDA operations. By default, it points to a null stream CUDA's default execution stream."]}),"\n"]}),"\n",(0,s.jsxs)(i.li,{children:["\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"device_id: usize"})})}),"\n",(0,s.jsxs)(i.p,{children:["The index of the GPU currently in use. The default value is ",(0,s.jsx)(i.code,{children:"0"}),", indicating the first GPU in the system."]}),"\n",(0,s.jsxs)(i.p,{children:["In some cases assuming ",(0,s.jsx)(i.code,{children:"CUDA_VISIBLE_DEVICES"})," was configured, for example as ",(0,s.jsx)(i.code,{children:"CUDA_VISIBLE_DEVICES=2,3,7"})," in the system with 8 GPUs - the ",(0,s.jsx)(i.code,{children:"device_id=0"})," will correspond to GPU with id 2. So the mapping may not always be a direct reflection of the number of GPUs installed on a system."]}),"\n"]}),"\n",(0,s.jsxs)(i.li,{children:["\n",(0,s.jsx)(i.p,{children:(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"mempool: CudaMemPool"})})}),"\n",(0,s.jsx)(i.p,{children:"Represents the memory pool used for CUDA memory allocations. The default is set to a null pointer, which signifies the use of the default CUDA memory pool."}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(i.h5,{id:"implementation-notes",children:"Implementation Notes"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["The ",(0,s.jsx)(i.code,{children:"DeviceContext"})," structure is cloneable and can be debugged, facilitating easier logging and duplication of contexts when needed."]}),"\n"]}),"\n",(0,s.jsx)(i.h4,{id:"devicecontextdefault_for_devicedevice_id-usize---devicecontextstatic",children:(0,s.jsx)(i.a,{href:"https://github.com/ingonyama-zk/icicle/blob/e6035698b5e54632f2c44e600391352ccc11cad4/wrappers/rust/icicle-cuda-runtime/src/device_context.rs#L30",children:(0,s.jsx)(i.code,{children:"DeviceContext::default_for_device(device_id: usize) -> DeviceContext<'static>"})})}),"\n",(0,s.jsxs)(i.p,{children:["Provides a default ",(0,s.jsx)(i.code,{children:"DeviceContext"})," with system-wide defaults, ideal for straightforward setups."]}),"\n",(0,s.jsx)(i.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsxs)(i.p,{children:["A ",(0,s.jsx)(i.code,{children:"DeviceContext"})," instance configured with:"]}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:["The default stream (",(0,s.jsx)(i.code,{children:"null_mut()"}),")."]}),"\n",(0,s.jsxs)(i.li,{children:["The default device ID (",(0,s.jsx)(i.code,{children:"0"}),")."]}),"\n",(0,s.jsxs)(i.li,{children:["The default memory pool (",(0,s.jsx)(i.code,{children:"null_mut()"}),")."]}),"\n"]}),"\n",(0,s.jsx)(i.h4,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"device_id: usize"})}),": The ID of the device for which to create the context."]}),"\n"]}),"\n",(0,s.jsx)(i.h4,{id:"returns-1",children:"Returns"}),"\n",(0,s.jsxs)(i.p,{children:["A ",(0,s.jsx)(i.code,{children:"DeviceContext"})," instance with the provided ",(0,s.jsx)(i.code,{children:"device_id"})," and default settings for the stream and memory pool."]}),"\n",(0,s.jsx)(i.h4,{id:"check_devicedevice_id-i32",children:(0,s.jsx)(i.a,{href:"https://github.com/vhnatyk/icicle/blob/eef6876b037a6b0797464e7cdcf9c1ecfcf41808/wrappers/rust/icicle-cuda-runtime/src/device_context.rs#L42",children:(0,s.jsx)(i.code,{children:"check_device(device_id: i32)"})})}),"\n",(0,s.jsxs)(i.p,{children:["Validates that the specified ",(0,s.jsx)(i.code,{children:"device_id"})," matches the ID of the currently active device, ensuring operations are targeted correctly."]}),"\n",(0,s.jsx)(i.h4,{id:"parameters-1",children:"Parameters"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"device_id: i32"})}),": The device ID to verify against the currently active device."]}),"\n"]}),"\n",(0,s.jsx)(i.h4,{id:"behavior",children:"Behavior"}),"\n",(0,s.jsxs)(i.ul,{children:["\n",(0,s.jsxs)(i.li,{children:[(0,s.jsx)(i.strong,{children:(0,s.jsx)(i.code,{children:"Panics"})})," if the ",(0,s.jsx)(i.code,{children:"device_id"})," does not match the active device's ID, preventing cross-device operation errors."]}),"\n"]}),"\n",(0,s.jsx)(i.h4,{id:"example",children:"Example"}),"\n",(0,s.jsx)(i.pre,{children:(0,s.jsx)(i.code,{className:"language-rust",children:"let device_id: i32 = 0; // Example device ID\ncheck_device(device_id);\n// Ensures that the current context is correctly set for the specified device ID.\n"})})]})}function h(e={}){const{wrapper:i}={...(0,t.R)(),...e.components};return i?(0,s.jsx)(i,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},8453:(e,i,n)=>{n.d(i,{R:()=>d,x:()=>r});var c=n(6540);const s={},t=c.createContext(s);function d(e){const i=c.useContext(t);return c.useMemo((function(){return"function"==typeof e?e(i):{...i,...e}}),[i,e])}function r(e){let i;return i=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:d(e.components),c.createElement(t.Provider,{value:i},e.children)}}}]);