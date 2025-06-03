const Plan = () => {
  return (
    <div className="flex border-t p-2 border-stone-300 justify-between text-xs">
      <div className="flex flex-col">
        <p className="font-bold">Enterprise</p>
        <p className="text-stone-500">Pay as you go</p>
      </div>
      <button className="bg-stone-200 hover:bg-stone-300 transition-colors rounded-md px-2">Support</button>
    </div>
  );
};

export default Plan;
