import {
  QMainWindow,
  QWidget,
  QScrollArea,
  QLabel,
  QBoxLayout,
  QPushButton,
  QIcon,
  QTabWidget,
  Direction,
  QApplication,
  QClipboardMode,
} from "@nodegui/nodegui";
const emojis = require("./emojis.json");

const clipboard = QApplication.clipboard();

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
    itemBox.addWidget(itemEmoji, 1);
    listBox.addLayout(itemBox);
  });
  const randomIndex = Math.floor(Math.random() * data.length);
  tabs.addTab(scroll, new QIcon(), data[randomIndex].emoji + " " + category);
}

const win = new QMainWindow();
win.setWindowTitle("😆 Emojis!");

const topLabel = new QLabel();
topLabel.setText("Top");
topLabel.setObjectName("topLabel");

const tabs = new QTabWidget();

emojis.forEach(cat => {
  createTab(cat);
});

win.resize(500, 400);
win.setMinimumSize(500, 400);

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
      font-size: 14px;
    }

    #emoji {
      font-size:32px;
    }
    QPushButton{
      height:40px;
    }
  `
);
win.show();

(global as any).win = win;
