cmake_minimum_required(VERSION 3.10)
project(calc_engine CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(include)

file(GLOB SOURCES "src/*.cpp")

add_library(calc_engine STATIC ${SOURCES})
