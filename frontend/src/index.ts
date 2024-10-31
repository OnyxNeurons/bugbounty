import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { HomePage } from "./pages/home/page";
import { ReportsPage } from "./pages/report/page";
import { ProgramsPage } from "./pages/program/index";
import { PlatformsPage } from "./pages/platform/index";
import { NewPlatformPage } from "./pages/platform/new";
import { EditPlatformPage } from "./pages/platform/edit";
import { ViewProgramPage } from "./pages/program/view";

export const pages = (OnyxSDK: any) => {
  const root = document.createElement("div");
  Object.assign(root.style, {
    height: "100%",
    width: "100%", 
  });
  root.id = 'neuron-bugbounty-root';

  const rootApp = createRoot(root);

  return [
    {
      path: '/',
      component: () => {
        rootApp.render(createElement(HomePage, { OnyxSDK }));
        return root;
      },
    },
    {
      path: '/report',
      component: () => {
        rootApp.render(createElement(ReportsPage, { OnyxSDK }));
        return root;
      },
    },
    {
      path: '/program',
      component: () => {
        rootApp.render(createElement(ProgramsPage, { OnyxSDK }));
        return root;
      },
    },
    {
      path: '/platform',
      component: () => {
        rootApp.render(createElement(PlatformsPage, { OnyxSDK }));
        return root;
      },
    },
    {
      path: '/platform/new',
      component: () => {
        rootApp.render(createElement(NewPlatformPage, { OnyxSDK }));
        return root;
      },
    },
    {
      path: '/platform/edit',
      component: () => {
        rootApp.render(createElement(EditPlatformPage, { OnyxSDK }));
        return root;
      },
    },
    {
      path: '/program/view',
      component: () => {
        rootApp.render(createElement(ViewProgramPage, { OnyxSDK }));
        return root;
      },
    },
  ]
}