{
  !authenticated && (
    <li className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-10 z-40">
      <div
        className={`p-[1px] hover:p-[2px] bg-gradient-to-t from-indigo-500 to-transparent rounded-lg shadow-lg shadow-indigo-500/20 transition-padding transition-transform transition-colors ease-in-out duration-300 ${
          showLogin ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          onClick={openLoginBox}
          className={`flex items-center cursor-pointer p-2 rounded-lg w-full h-full group transition-colors relative ${
            showLogin
              ? "text-white bg-gray-950"
              : "text-gray-900 dark:text-white bg-white dark:bg-gray-950"
          }`}
        >
          <span className="flex-1 pl-2 pr-2 whitespace-nowrap">Dev Tools</span>
        </div>
      </div>
    </li>
  );
}
