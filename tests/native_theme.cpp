#include "gui/Theme.h"
#include "imgui.h"
#include <filesystem>
#include <cstdio>
#include <cmath>
using namespace midipro::gui;
int main(int argc,char** argv) {
    if(argc!=3)return 2;
    ImGui::CreateContext();
    setUiDpiScale(1.25f);
    applyThemeParams(themeDark());
    const auto padding=ImGui::GetStyle().WindowPadding;
    int count=0;
    for(const auto& entry:std::filesystem::directory_iterator(argv[1])) {
        if(entry.path().extension()!=".mptheme")continue;
        ThemeParams loaded;
        WindowStyleOverride windows[kThemeWindowCount]{};
        for(int i=0;i<50;++i) {
            if(!importTheme(entry.path(),loaded,windows,argv[2]))return 3;
            if(!loaded.bgLayers.empty())return 4;
            if(std::fabs(ImGui::GetStyle().WindowPadding.x-padding.x)>.01f)return 5;
            if(!std::isfinite(loaded.accent[0])||loaded.background.mode<1)return 6;
        }
        std::printf("PASS: native import x50: %s\n",entry.path().filename().string().c_str());
        ++count;
    }
    ImGui::DestroyContext();
    std::printf("Native MidiStudio Theme.cpp verified %d downloadable themes.\n",count);
    return count==6?0:7;
}
