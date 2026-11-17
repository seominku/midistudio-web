@echo off
setlocal
if "%~1"=="" exit /b 2
call "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" >nul
if errorlevel 1 exit /b 3
if not exist test-artifacts mkdir test-artifacts
cl /nologo /EHsc /std:c++17 /utf-8 /O2 /W3 /I "%~1\src" /I "%~1\external\imgui" tests\native_theme.cpp "%~1\build\Theme.obj" "%~1\build\imgui.obj" "%~1\build\imgui_draw.obj" "%~1\build\imgui_tables.obj" "%~1\build\imgui_widgets.obj" user32.lib imm32.lib /Fe:test-artifacts\NativeThemes.exe /Fo:test-artifacts\native_theme.obj
if errorlevel 1 exit /b 4
test-artifacts\NativeThemes.exe dist\themes test-artifacts\theme-import
exit /b %errorlevel%
