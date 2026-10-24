export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="w-full flex items-center justify-center h-10 border-t border-gray-300 border-dashed">
      <div className="max-w-(--max-width) flex justify-between items-center w-full h-full px-5">
        <p>@Copernicus {year}</p>
      </div>
    </div>
  );
}
