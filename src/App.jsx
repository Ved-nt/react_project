import "./index.css";
import Canvas from "./Canvas";
import data from "./data";
import { useEffect, useState, useRef } from "react";
import LocomotiveScroll from 'locomotive-scroll';
import gsap from "gsap";

function App() {

  const [showCanvas, setShowCanvas] = useState(false);
  const [isRedBackground, setIsRedBackground] = useState(false);
  const headingref = useRef(null);
  const growingSpan = useRef(null);
  const textRevealRef = useRef(null);
  const buttonref1 = useRef(null);
  const buttonref2 = useRef(null);


  //for button at the end of the the website
  const defaultStyle = {
    margin: "10px",
    backgroundColor: "#000",
    color: "#fff",
    width: "200px",
    border: "1px solid rgba(220, 220, 220, 0.3)",
    borderRadius: "24px",
    padding: "5px 25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "400",
    textDecoration: "underline",
  };

  const defaultStyle2 = {
    margin: "10px",
    backgroundColor: "#000",
    color: "#fff",
    width: "160px",
    border: "1px solid rgba(220, 220, 220, 0.3)",
    borderRadius: "24px",
    padding: "5px 25px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "400",
    textDecoration: "underline"};

  const handleHover = (e, enter = true) => {
    if (isRedBackground) {
      // Behavior when the background is red
      if (enter) {
        e.target.style.backgroundColor = "#000"; // Black background
        e.target.style.color = "#fd2c2a"; // Red text
        e.target.style.transform = "scale(1.1)";
      } else {
        e.target.style.backgroundColor = "#fd2c2a"; // Red background
        e.target.style.color = "#000"; // Black text
        e.target.style.transform = "scale(1)";
        e.target.style.border = "1px solid rgb(139, 0, 0, 0.2)";
      }
    } else {
      // Default behavior when the background is not red
      if (enter) {
        e.target.style.backgroundColor = "#fff"; // White background
        e.target.style.color = "#000"; // Black text
        e.target.style.border = "1px solid black";
        e.target.style.transform = "scale(1.1)";
      } else {
        e.target.style.backgroundColor = "#000"; // Black background
        e.target.style.color = "#fff"; // White text
        e.target.style.border = "1px solid rgba(220, 220, 220, 0.3)";
        e.target.style.transform = "scale(1)";
      }
    }
  };

  const scrollToTop = () => {
    const duration = 900; // Duration in milliseconds
    const interval = 10; // Interval in milliseconds
    const scrollStep = -window.scrollY / (duration / interval);

    const scroll = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scroll);
      }
    }, interval);
  };  

  useEffect(() => {//for scroll animation
    const locomotivescroll = new LocomotiveScroll();
  }, []);

  useEffect(() => {
    const buttons = [buttonref1.current, buttonref2.current];
    
    if (isRedBackground) {
      // Set styles for red background
      buttons.forEach((button) => {
        if (button) {
          button.style.backgroundColor = "#fd2c2a"; // Red background
          button.style.color = "#000"; // Black text
          button.style.border = "1px solid rgba(139, 0, 0, 0.2)"; // Subtle red border
        }
      });
    } else {
      // Reset styles for default background
      buttons.forEach((button) => {
        if (button) {
          button.style.backgroundColor = "#000"; // Black background
          button.style.color = "#fff"; // White text
          button.style.border = "1px solid rgba(220, 220, 220, 0.3)"; // Default border
        }
      });
    }
  }, [isRedBackground]);

  useEffect(() => {
    // IntersectionObserver for continuous text reveal effect
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const lines = entry.target.querySelectorAll(".line");

          // When the element is in view (scrolling down)
          if (entry.isIntersecting) {
            // Fade In when the element enters the viewport
            gsap.timeline().fromTo(
              lines,
              { opacity: 0, y: "100%" }, // Start hidden
              { opacity: 1, y: "0%", duration: 1.5, ease: "power4.out", stagger: 0.2 }
            );
          } else {
            // Fade Out when the element leaves the viewport (scrolling up)
            gsap.timeline().to(
              lines,
              { opacity: 0, y: "100%", duration: 0.8, ease: "power2.inOut" }
            );
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the div is visible
    );

    if (textRevealRef.current) {
      observer.observe(textRevealRef.current);
    }

    return () => observer.disconnect();
  }, []);
  

  useEffect(() => {//for when the user clicks on heading effect 
    const handleClick = (e)=>{//whenever the heading is clicked, the showCanvas state is toggled
      setShowCanvas((prevShowCanvas) => {
        if (!prevShowCanvas) {
          gsap.set(growingSpan.current, {
            top: e.clientY,
            left: e.clientX,
          });

          gsap.to("body", {
            color: "#000",
            backgroundColor: "#fd2c2a",
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => setIsRedBackground(true),
          });

          gsap.to(growingSpan.current, {
            scale: 1000,
            duration: 2,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(growingSpan.current, {
                scale: 0,
                clearProps: "all",
              });
            },
          });
        }
        else {
          gsap.to("body", {
            color: "#fff",
            backgroundColor: "#000",
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => setIsRedBackground(false),
          });
        }
        return !prevShowCanvas;

      });
    };

    const headingElement = headingref.current;
    headingElement.addEventListener("click",handleClick);

    return () => headingElement.removeEventListener("click",handleClick);
  },[]);
  
  return ( 
    <>
      <span ref={growingSpan} className="growing rounded-full block fixed top-[-20px] left-[-20px] w-5 h-5"></span>
      <div className="relative min-h-screen font-sans">
        {showCanvas && data[0].map((canvasdets,index)=>(//item is an array of objects
          <Canvas key={index} details={canvasdets}/>  
        ))}
        <div className="w-full relative h-screen z-[1]">
          <nav className="w-full p-3 z-50 flex justify-between">
            <div className="brand text-2xl font-regular">Thirtysixstudio</div>
            <div className="links flex gap-10 mr-5">
              {["What we do","Who we are","How we give back","Talk to us"].map((link, index) => (
                <a
                  key={index}
                  href={`#${link.toLowerCase()}`}
                  className="text-md"
                >
                  {link}
                </a>
              ))}
            </div>
          </nav>
          <div className="textcontainer w-full px-[20%] mt-7 mb-5 opacity-90">
            <div className="text w-[40%]">
              <h3 className="text-3xl leading-[1.3] ">
                At Thirtysixstudio, we build immersive digital experiences for
                brands with a purpose.
              </h3>
              <p className="text-xl w-[95%] mt-8 font-normal">
              We’re a boutique production studio focused on design, motion, and
              creative technology, constantly reimagining what digital craft
              can do for present-time ads and campaigns.
              </p>
              <p className="text-md mt-6">Scroll</p>
            </div>
          </div>
          <div className="w-full absolute left-0 bottom-0">{/*pl-5  for my laptop and pl-12 for kiit*/}
            <h1 
            ref={headingref}
            className="text-[13.2rem] font-normal tracking-tight leading-none opacity-90 pl-4 " style={{ letterSpacing: '0.03em' }}
            >
              Thirtysixstudio
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full relative flex  justify-center h-screen mt-20 ">
        {showCanvas && data[1].map((canvasdets,index)=>(//item is an array of objects
          <Canvas key={index} details={canvasdets}/>  
        ))}
          <div className="w-[40%] z-[1]">
            <h4 className="text-lg mt-1 font-semibold text-[1.15rem]">01 - WHAT WE DO</h4>
          </div>
          <div className="w-[30%] ">
            <h3 className="text-3xl text-[2.15rem] opacity-90 font-normal leading-[1.2] tracking-wide">
              We aim to revolutionize digital production in the advertising space,
              bringing your ideas to life.
            </h3>
            <p className="w-[100%] text-xl mt-12 opacity-90">
              As a contemporary studio, we use cutting-edge design practices and the latest technologies
              to deliver seamless digital work.
            </p>
            <p className="text-xl mt-5 opacity-90 ">
              Our commitment to creativity, innovation, and simplicity, paired with our agile approach, 
              ensures your journey with us is smooth and enjoyable from start to finish.
            </p>
          </div>
      </div> 
      <div className="w-full relative h-screen mt-15">
      {showCanvas && data[2].map((canvasdets,index)=>(//item is an array of objects
          <Canvas key={index} details={canvasdets}/>  
        ))}
        <div>
          <h2 className="text-md mt-1 px-[20%] font-semibold text-[1rem]">OUR SERVICES</h2>
        </div>
        <div ref={textRevealRef} className="text-reveal-container w-full px-[20%] mt-10">
          <div className="text">
            <span className="line text-[1.55rem] leading-[2.5rem] block">
              We provide captivating design,
            </span>
            <span className="line text-[1.55rem] leading-[2.5rem] block">
              interactive animations, advanced usability,
            </span>
            <span className="line text-[1.55rem] leading-[2.5rem] block">
              reliable code, and immaculate project coordination.
            </span>
            <span className="line text-[1.55rem] leading-[2.5rem] block">
              Whether you need a campaign built from scratch
            </span>
            <span className="line text-[1.55rem] leading-[2.5rem] block">
              or assistance at a specific phase, we’ve got you covered.
            </span>
          </div>
        </div>
      </div>
      <div className="w-full relative h-100vh z-[1] mt-1 mb-5">
        {showCanvas && data[3].map((canvasdets,index)=>(//item is an array of objects
          <Canvas key={index} details={canvasdets}/>  
        ))}
        <div className="contained flex justify-center gap-40 text-[1.05rem]">
          <div className="flex gap-10 ml-8">
            <p>Linkedin</p>
            <p>Instagram</p>
          </div>
          <div>
            <p>hello@Thirtysixstudio.com</p>
            <p>Amsterdam and worldwide</p>
          </div>
        </div>
        <div className="contain flex justify-center mt-20 gap-40 text-[1.05rem]">
          <div className="">
            <p>All Rights Reserved</p>
            <p>©2024</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",}}>
            <button
              ref={buttonref1}
              style={defaultStyle}
              onMouseEnter={(e) => handleHover(e)}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              Privacy Statement
            </button>
            <button
              ref={buttonref2}
              onClick={scrollToTop}
              style={defaultStyle2}
              onMouseEnter={(e) => handleHover(e)}
              onMouseLeave={(e) => handleHover(e, false)}
            >
              Back To Top
            </button>
          </div>
        </div>
        <div className="mt-28">
          <h4 className="ml-96 text-4xl">Thirtysixstudio</h4>
        </div>
      </div>
      {/* = */}
      {/* <hr className="border-t border-[white]-900 ml-5 mr-5 opacity-15 mt-10 " /> */}
      


      
    </>
  );
}

export default App;
