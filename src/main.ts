import { app, BrowserWindow, Tray, Menu } from "electron";
import Server from "ust-server";
import * as path from "path";

// Used to prevent app from relaunching with Windows installer
if (require("electron-squirrel-startup")) {
  app.quit();
}

const title = "Untitled Stream Tool";
const icon = path.join(__dirname, "../assets/icon.png");
const serverProperties = {
  address: "127.0.0.1",
  httpPort: 4000,
  socketPort: 4001,
};

let mainWindow: Electron.BrowserWindow;
let server: Server;

let tray = null;
let isQuitting = false;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    title: title,
    icon: icon,
  });
  mainWindow.loadURL(
    "http://" + serverProperties.address + ":" + serverProperties.httpPort
  );
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
          server.stop();

          isQuitting = true;
          app.quit();
        },
      },
    ])
  );
}

app.on("ready", () => {
  server = new Server(
    serverProperties.address,
    serverProperties.httpPort,
    serverProperties.socketPort
  );
  server.start();

  createWindow();
});

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
