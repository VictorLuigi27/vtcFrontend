import { useState } from "react";
import ModalMenu from "../modal/modalMenu";

export default function Header() {
    const [openModal, setOpenModal] = useState(false);
    const toggleModal = () => setOpenModal(!openModal);

    return (
      <nav className="bg-neutral-900 p-4 lg:p-8">
        <div className="flex justify-center items-center space-x-28 lg:space-x-[40rem]">
          <img 
          src="/public/taxi-driver.svg" 
          alt="Logo Taxi Driver" 
          className="h-8 w-8 lg:h-16 lg:w-16" />
          <p className="text-white text-xl font-semibold lg:text-4xl">VTC</p>
          <img 
          src="/public/menu.svg" 
          alt="Menu" 
          className="h-8 w-8 lg:h-12 lg:w-12" 
          onClick={toggleModal}
          />
        </div>

        <ModalMenu openModal={openModal} setOpenModal={setOpenModal} />
      </nav>
    );
  }
  