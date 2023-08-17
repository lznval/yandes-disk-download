import YandexDiskUploader from "./YandexDiskUploader";

const token = 'тут указать свой токен для использования Яндекс API';
const folder = 'тут указывается название папки в Яндекс Диске';

function App() {
  return (
    <div className="App">
      <YandexDiskUploader token={token} folder={folder} />
    </div>
  );
}

export default App;
