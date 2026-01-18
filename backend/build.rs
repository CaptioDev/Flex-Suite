fn main() {
    println!("cargo:rerun-if-changed=../calc_engine/src/engine.cpp");
    println!("cargo:rerun-if-changed=../calc_engine/include/engine.h");

    cc::Build::new()
        .cpp(true)
        .std("c++20")
        .file("../calc_engine/src/engine.cpp")
        .include("../calc_engine/include")
        .compile("calc_engine");
        
    println!("cargo:rustc-link-lib=stdc++"); 
}
