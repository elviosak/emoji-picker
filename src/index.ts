import {
  QMainWindow,
  QMainWindowSignals,
  QWidget,
  QScrollArea,
  QLabel,
  QMenu,
  QAction,
  QBoxLayout,
  QPushButton,
  QIcon,
  QTabWidget,
  Direction,
  QApplication,
  QClipboardMode,
  QSystemTrayIcon,
  QFontDatabase,
  QFont,
} from "@nodegui/nodegui";
import path from "path";
import { EventWidget, WidgetEventTypes } from "@nodegui/nodegui/dist/lib/core/EventWidget";
const emojis = require("./emojis.json");
const notoFont = require("./fonts/NotoColorEmoji.ttf");

const id = QFontDatabase.addApplicationFont(
  path.resolve(__dirname, notoFont.default)
);

const clipboard = QApplication.clipboard();
const qApp = QApplication.instance();
//qApp.setQuitOnLastWindowClosed(false);
function createTab({ category, data }) {
  const scroll = new QScrollArea();
  const list = new QWidget();
  const listBox = new QBoxLayout(Direction.TopToBottom);
  list.setLayout(listBox);
  scroll.setWidget(list);
  data.forEach(item => {
    const itemBox = new QBoxLayout(Direction.LeftToRight);
    const itemText = new QPushButton();
    const itemEmoji = new QPushButton();
    itemText.setText(item.text);
    itemText.setProperty("toolTip", "Copy Text");
    itemText.addEventListener("clicked", () => {
      clipboard.setText(item.text, QClipboardMode.Clipboard);
    });

    itemEmoji.setText(item.emoji);
    itemEmoji.setObjectName("emoji");
    itemEmoji.setProperty("toolTip", "Copy Emoji");
    itemEmoji.addEventListener("clicked", () => {
      clipboard.setText(item.emoji, QClipboardMode.Clipboard);
    });
    itemBox.addWidget(itemText, 3);
    itemBox.addWidget(itemEmoji,1);
    listBox.addLayout(itemBox);
  });
  const randomIndex = Math.floor(Math.random() * data.length);
  tabs.addTab(scroll, new QIcon(), data[randomIndex].emoji + " " + category);
}

const win = new QMainWindow();
const tray = new QSystemTrayIcon();
const icons = [
  require("./icons/nodegui.png"),
  require("./icons/nodegui_white.png")
];
let iconIndex = 0;
function toggleIcon() {
  iconIndex = 1 - iconIndex;
  const qicon = new QIcon(path.resolve(__dirname, icons[iconIndex].default));
  win.setWindowIcon(qicon);
  tray.setIcon(qicon);
}
toggleIcon();

const menu = new QMenu();
tray.setContextMenu(menu);

const iconToggler = new QAction();
iconToggler.setText("Toggle Icon Color");
iconToggler.addEventListener("triggered", toggleIcon);
menu.addAction(iconToggler);
function toggleWindow() {
  win.setProperty("visible", !win.isVisible());
}
const winToggler = new QAction();
winToggler.setText("Show/Hide Window");
winToggler.addEventListener("triggered", toggleWindow);
menu.addAction(winToggler);
function separator() {
  const separator = new QAction();
  separator.setSeparator(true);
  return separator;
}

tray.addEventListener("activated", e => {
  if (e == 3) toggleWindow();
});

menu.addAction(separator());
const font = new QFont("NotoColorEmoji", 20)

function categorySubMenu({ category, data }) {
  const actionWithSubmenu = new QAction();
  const subMenu = new QMenu();

  data.forEach(({ emoji, text }) => {
    const emojiAction = new QAction();
    emojiAction.setText(emoji);
    emojiAction.setFont(font)
    emojiAction.setProperty('toolTip', text)
    emojiAction.setProperty('objectName', "action")
    emojiAction.addEventListener("triggered", () => {
      clipboard.setText(emoji, QClipboardMode.Clipboard);
    });

    subMenu.addAction(emojiAction);
  });

  actionWithSubmenu.setMenu(subMenu);
  actionWithSubmenu.setText(category);
  menu.addAction(actionWithSubmenu);
}

emojis.forEach(categorySubMenu);
menu.addAction(separator());

const quitter = new QAction();
quitter.setText("Quit");
quitter.addEventListener("triggered", () => {
  qApp.exit(0);
});
menu.addAction(quitter);
tray.show();
win.setWindowTitle("😆 Emojis!");

const topLabel = new QLabel();
topLabel.setText("Top");
topLabel.setObjectName("topLabel");
const tabs = new QTabWidget();

emojis.forEach(cat => {
  createTab(cat);
});
win.addEventListener(WidgetEventTypes.MouseButtonPress,()=>{
  console.log('press')
} )
win.resize(600, 400);
win.setMinimumSize(600, 400);

win.setCentralWidget(tabs);
win.setStyleSheet(
  `
    #myroot {
      background-color: #888888;
      
    }
    QTabWidget{
      padding:0;
    }
    * {
      font-family: "NotoColorEmoji";
      font-size: 14px;
    }
    #action{
      font-family: "NotoColorEmoji";
    }
    QMenu {
      font-family: "NotoColorEmoji";
    }
    #emoji {
      font-size:32px;
    }
    QPushButton{
      
      height:40px;
    }
    #emojiAction{
      font-size:20px;
    }
  `
);
win.show();

(global as any).win = win;
