import gymBg from "../../assets/gymBg.jpg"

function GymBackground ({focused}) {
    return(
        <div className="absolute inset-0 overflow-hidden">
            <img 
                src={gymBg}
                alt=""
                className="w-full h-full object-cover transition-all duration-1000 ease-out"
                style={{
                    filter: focused ? "blur(8px) brightness(0.5)" : "blur(0px) brightness(0.8)",
                    transform: focused? "scale(1.08)" : "scale(1)"
                }}
            />

            <div 
                className="absolute inset-0 bg-black transition-opacity duration-100"
                style={{ opacity: focused ? 0.45 : 0.2 }}
            />
        </div>
    );
}

export default GymBackground;