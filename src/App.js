import YandexDiskUploader from "./YandexDiskUploader";

// const token = 'тут указать свой токен для использования Яндекс API';
// const folder = 'тут указывается название папки в Яндекс Диске';

const token = 'y0_AgAAAAAWmtXFAADLWwAAAADpE1G2rk28QusFQXWKNy-_Arb2A-mGTq0';
const folder = 'Музыка';
function App() {
  return (
    <div className="App">
      <YandexDiskUploader token={token} folder={folder} />
    </div>
  );
}

export default App;
