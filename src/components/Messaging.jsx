import  { useContext, useEffect, useState } from "react";
import  { DatabaseContext } from "../contexts/Database";
import girl from "../assets/girl.jpeg";
import { AuthContext } from "../contexts/AuthProvider";
import { toast } from "react-hot-toast";
import loader from '../assets/220 (2).gif'
import axios from "axios";
const Messaging = () => {
  const { userDb } = useContext(AuthContext);
  const { data } = useContext(DatabaseContext);
  const [geoObject, setGeoObject] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true);




  const { geolocationHistory } = data;

  useEffect(() => {
    setGeoObject({ ...geolocationHistory });
  }, [data]);

  console.log(data);

  const geoArray =
    data &&
    Object.entries(geoObject).map(([key, value]) => {
      return {
        key,
        ...value,
      };
    });

  geoArray && geoArray.sort((a, b) => b.date - a.date);

  

  const radiusArray = geoArray && geoArray.map((each) => Number(each.radius));

  const radiusCircleData = geoArray && geoArray.map((item) => item.radius);
  const locationCircleData =
    geoArray && geoArray.map((item) => item.place_name);

  console.log(radiusCircleData, locationCircleData);

  const mostRecent = geoArray && geoArray.map((item) => Number(item.date));

  const sortedTimes = mostRecent && mostRecent.sort((a, b) => b - a);

  console.log(sortedTimes);

  const firstTime = (sortedTimes && sortedTimes[0]) || 0;
  console.log(firstTime);
  const firstRadius =
    (radiusArray && radiusArray?.sort((a, b) => b - a)[0]) || 0;
  console.log(firstRadius);
  const firstGeoHistory = (firstTime && geolocationHistory[firstTime]) ||0;


 /*  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // in kilometers

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    return distance;
  } */


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false); // Update loading state
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude); 

        setIsLoading(false); // Update loading state
      },
      (error) => {
        setError(`Error: ${error.message}`);
        setIsLoading(false); // Update loading state
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId); // Cleanup the watchPosition listener
    };
  }, []);

  // console.log(firstGeoHistory);



  const currentLocation = {
    lat: latitude,
    lon: longitude,
  };console.log(currentLocation);

  const date = new Date().getTime();

  console.log(date);
  let initialMessage = {
    content: "",
    phonenumber: userDb?.phonenumber,
    time: date,
  }

  useEffect(()=>{

    setMessage({

      
    

      content: `Hello ${userDb?.nextofkin} Its me ${userDb?.firstname} ${userDb?.lastname} I've been kidnapped. Please reach out to the authorities. My last know coordinates are https://www.latlong.net/c/?lat=${userDb && latitude}&long=${userDb && longitude}
    `,
    phonenumber: userDb?.phonenumber,
    time: date,

    })

  },[userDb,longitude,latitude])

  

  console.log(initialMessage, "INIT");
  const [message, setMessage] = useState(initialMessage);

  console.log(userDb);
  const handleChange = (e) => {
    const { value, name } = e.target;
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)


    await axios.post("https://geofence-server.onrender.com/send",{content:message.content,number:message.phonenumber}).then((res)=>{
      console.log(res);
      setLoading(false)
      toast.success("Success: Alert created !")
    }).catch((err)=>{
      setLoading(false)
      toast.error(`Error:${err.message}`)
      console.log(err)
    })

   /*  try {
      const response = await fetch("http://localhost:3001/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await response
        .json()
        .then(() => {toast.success("Success: Message sent successfully");setLoading(false)});
      console.log(data);
    } catch (error) {
        setLoading(false)
      toast.error(error.message);
    } */
  };

  console.log(message);
  return (
    <>
      {
       ( geolocationHistory && data && userDb) ?(
          <div className="w-full h-full flex justify-center items-center flex-col bg-[#5B5AC5]">
        <div className="w-32 h-32 rounded-full border-2 border-blue-500 overflow-hidden">
          <img
            src={girl}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

        <h4 className="my-4 font-bold text-base lg:text-2xl text-white">Create an Alert</h4>

        <form
          className="mx-4 lg:w-[400px] shadow-lg flex flex-col items-center bg-white rounded-lg"
          onSubmit={handleSubmit}
        >
          <span className="mx-5">
            <label htmlFor="">Next of Kin Phone number</label>
            <input
              type="text"
              defaultValue={message?.phonenumber}
              name="phonenumber"
              onChange={handleChange}
              className="w-full px-4 border-4 border-blue-700"
            />
          </span>
          <span className="mx-5">
            <label htmlFor="">Message</label>
            <textarea
              className="w-full border-4 border-blue-700  px-4"
              name="content"
              onChange={handleChange}
              value={message.content}
              id=""
              cols="30"
              rows="10"
            ></textarea>
          </span>
          <span></span>
          <span className="w-full ">
            <button className="w-full  flex text-center justify-center items-center bg-blue-700 text-white p-2" type="submit">
              {loading?<img width={60} src={loader}/>:"Send Message"}
            </button>
          </span>
        </form>
      </div>

        ):<div className="w-full h-full top-0 absolute flex  items-center justify-center backdrop-brightness-50 flex-col gap-5">
        <div className="text-white text-base lg:text-2xl italic">Loading...</div>
        <img src={loader} alt="loader" width={"100px"} />
      </div>
      }    </>
  );
};

export default Messaging;
