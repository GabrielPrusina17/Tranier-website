import { motion } from "framer-motion";
import appLogo from "../../assets/appLogo.png"

function SplashScreen () {
    return(
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-[#131515] z-50"
        >
            <motion.img 
                src={appLogo}
                alt="Josip Drežnjak"
                className="h-40 sm:h-56 md:h-72 lg:h-80 xl:h-56 w-auto object-contain"
                animate={{ scale:[1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut"}}
            />
        </motion.div>
    )
}

export default SplashScreen;