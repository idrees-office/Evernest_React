const Loader = () => {
    return(
        <div className="absolute inset-0 flex justify-center items-center z-10 bg-white bg-opacity-50">
              <span className="animate-[spin_3s_linear_infinite] border-8 border-r-warning border-l-primary border-t-danger border-b-success rounded-full w-14 h-14 inline-block align-middle m-auto"></span>
        </div>
    );
}
export default Loader;