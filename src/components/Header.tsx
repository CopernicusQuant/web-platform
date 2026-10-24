import { SignOutButton } from "@clerk/react";

export default function Header() {
  return (
    <div className="w-full flex items-center justify-center h-10 border-b border-gray-300 border-dashed">
      <div className="max-w-(--max-width) flex justify-between w-full h-full px-5">
        {/* <p>Copernicus</p> */}
        <img src="/favicon.svg" className="py-1" />
        <SignOutButton>SignOut</SignOutButton>
      </div>
    </div>
  );
}
