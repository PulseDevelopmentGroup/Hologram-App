import { app, BrowserWindow, Tray, Menu } from "electron";
import { Server } from "ust-server";
import * as path from "path";

const title = "Untitled Stream Tool";
const icon = path.join(__dirname, "../assets/icon.png");

let mainWindow: Electron.BrowserWindow;
let isQuitting = false;
let tray = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    title: title,
    icon: icon,
  });
  mainWindow.loadURL("https://localhost:4000");
  mainWindow.setMenu(null);

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  tray = new Tray(icon);
  tray.setToolTip(title);
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Restart Webserver",
        click: (): void => {
          //server.restart();
        },
      },
      {
        label: "Show",
        click: (): void => {
          mainWindow.show();
        },
      },
      {
        label: "Quit",
        click: (): void => {
          isQuitting = true;
          app.quit();
        },
      },
    ])
  );
}

function start(): void {
  const s = new Server("0.0.0.0", 4001, 4000);
  s.start();

  createWindow();
}

app.on("ready", start);

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
