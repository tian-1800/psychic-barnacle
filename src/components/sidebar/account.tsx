import Image from "next/image";

const Account = () => {
  return (
    <div className="border-b border-stone-300 mb-4 mt-2 pb-4">
      <button
        type="button"
        className="flex p-0.5 hover:bg-stone-200 rounded-md transition-colors relative gap-2 w-full items-center"
      >
        <Image
          src="https://api.dicebear.com/9.x/lorelei/svg"
          alt="user avatar"
          className="size-8 rounded shrink-0 bg-violet-500 shadow"
          width={32}
          height={32}
        />
        <div className="text-start">
          <p className="text-sm font-semibold">User</p>
          <p className="text-xs text-stone-500">user@user.com</p>
        </div>
      </button>
    </div>
  );
};

export default Account;
