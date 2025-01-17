import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_light_160.png";
import { SideSheet } from "@douyinfe/semi-ui";
import { IconMenu } from "@douyinfe/semi-icons";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div className="py-5 px-8 sm:px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/reference/drawdb">
            <img src={logo} alt="logo" className="me-2 h-[48px] sm:h-[32px]" />
          </Link>
          <div className="md:hidden flex space-x-6 ml-6">
            <Link
              className="text-lg font-semibold hover:text-indigo-700"
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Features
            </Link>
            <Link
              to="/reference/drawdb/editor"
              className="text-lg font-semibold hover:text-indigo-700"
            >
              Editor
            </Link>
            <Link
              to="/reference/drawdb/templates"
              className="text-lg font-semibold hover:text-indigo-700"
            >
              Templates
            </Link>
          </div>
        </div>
        <div className="md:hidden block space-x-3">
          <a
            title="Jump to Github"
            className="px-3 py-2 bg-zinc-100 hover:opacity-60 transition-all duration-300 rounded-full text-2xl"
            href="https://github.com/drawdb-io/drawdb"
          >
            <i className="opacity-70 bi bi-github" />
          </a>
          <a
            title="Follow us on X"
            className="px-3 py-2 bg-zinc-100 hover:opacity-60 transition-all duration-300 rounded-full text-2xl"
            href="https://x.com/drawDB_"
          >
            <i className="opacity-70 bi bi-twitter-x" />
          </a>
          <a
            title="Join the community on Discord"
            className="px-3 py-2 bg-zinc-100 hover:opacity-60 transition-all duration-300 rounded-full text-2xl"
            href="https://discord.gg/BrjZgNrmR6"
          >
            <i className="opacity-70 bi bi-discord" />
          </a>
        </div>
        <button
          onClick={() => setOpenMenu((prev) => !prev)}
          className="hidden md:inline-block h-[24px]"
        >
          <IconMenu size="extra-large" />
        </button>
      </div>
      <hr />
      <SideSheet
        title={
          <img src={logo} alt="logo" className="sm:h-[32px] md:h-[42px]" />
        }
        visible={openMenu}
        onCancel={() => setOpenMenu(false)}
        width={window.innerWidth}
      >
        <Link
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
          onClick={() => {
            document
              .getElementById("features")
              .scrollIntoView({ behavior: "smooth" });
            setOpenMenu(false);
          }}
        >
          Features
        </Link>
        <hr />
        <Link
          to="/reference/drawdb/editor"
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
        >
          Editor
        </Link>
        <hr />
        <Link
          to="/reference/drawdb/templates"
          className="hover:bg-zinc-100 block p-3 text-base font-semibold"
        >
          Templates
        </Link>
        <hr />
      </SideSheet>
    </>
  );
}
