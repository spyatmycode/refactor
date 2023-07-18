import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { DatabaseContext } from "../contexts/Database";
import girl from "../assets/girl.jpeg";
import Map from "../components/Map";

const GeolocationComponent = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [locationname, setLocationName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { data } = useContext(DatabaseContext);

  console.log(data);
  const { userDb } = useContext(AuthContext);

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

  console.log(data, "THissss");

  const [showModal, setShowModal] = useState(false);

  console.log(data);

  const { geolocationHistory } = data;

  console.log(geolocationHistory);

  const [geoObject, setGeoObject] = useState({});

  useEffect(() => {
    setGeoObject({ ...geolocationHistory });
  }, [data]);

  const geoArray =
    data &&
    Object.entries(geoObject).map(([key, value]) => {
      return {
        key,
        ...value,
      };
    });

  geoArray && geoArray.sort((a, b) => b.date - a.date);

  let me = [1, 2, 3];

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
  const firstGeoHistory = (firstTime && geolocationHistory[firstTime]) || 0;

  console.log(firstGeoHistory);

  function degToRad(deg) {
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
  }

  let geofenceCenter = {
    lat: (firstGeoHistory && firstGeoHistory?.center[1]) || 0,
    lon:  (firstGeoHistory && firstGeoHistory?.center[0]) || 0,
  };

  const currentLocation = {
    lat: latitude,
    lon: longitude,
  };

  const distance = calculateDistance(
    degToRad(geofenceCenter.lat),
    degToRad(geofenceCenter.lon),
    degToRad(currentLocation.lat),
    degToRad(currentLocation.lon)
  );

 

  console.log("Distance:", distance.toFixed(2), "km");



  console.log(distance);

  useEffect(() => {
    const getLocationName = async () => {
      if (latitude && longitude) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=10&appid=f69641da28e1611191ff665c76110cbf`
          );
          const data = await response.json();
          setLocationName(data[0]?.name);
        } catch (error) {
          console.error("Error while fetching location name:", error);
        }
      }
    };

    getLocationName();
  }, [latitude, longitude]);

  const refresh = () => {
    console.log("clickeddd");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        setError(`Error: ${error.message}`);
      }
    );
  };

  // Output: 3933.82 kilometers
  /* http://api.openweathermap.org/geo/1.0/reverse?lat=6.5142784&lon=3.3718272&limit=10&appid=f69641da28e1611191ff665c76110cbf */
  return (
    <>
      <div className="w-full ml-20 text-blue-600 font-bold text-base lg:text-2xl py-5">
        Home - Current Geofence Data
      </div>
      <div className="rounded-lg shadow-md flex items-center flex-row-reverse justify-around  p-4 mx-7 bg-[#FE8071] text-white">
        <div
          className="w-32 h-32 rounded-full border-[5px] border-black overflow-hidden"
          onClick={refresh}
        >
          <img
            src={girl}
            alt="Profile Image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col ">
          <span className="font-bold  text-base lg:text-3xl">
            {userDb && userDb.firstname}
          </span>
          <span className="text-xl">{userDb && userDb.lastname}</span>
          <span>Current Location:</span>
          <span className="text-black font-bold text-xl">
            {isLoading ? "Loading..." : latitude}, {longitude || "Loading..."}
          </span>
        </div>
      </div>

      <div className="my-5 flex flex-col justify-center gap-4 mx-7 place-items-center  lg:w-full items-center  lg:grid grid-cols-3">
        <div className="relative my-10 flex items-center justify-center w-full">
          <div className="w-[300px] flex justify-center items-center ">
            <Map coords={[3.4, 6.5]} locationname={locationname} />
          </div>
        </div>

        <div className="w-[300px] h-[300px] shadow-lg flex flex-col items-center justify-center bg-[#8C8DF7] rounded-lg">
          <span className="font-bold text-xl">Current Location Name:</span>

          <span className="text-base lg:text-3xl font-bold text-white">
            {" "}
            {locationname && locationname}
          </span>
        </div>

        <div className="w-[300px] rounded-lg h-[300px] shadow-lg flex flex-col items-center justify-center bg-orange-500">
          <span className="font-bold text-xl">Expected Location</span>

          <span className="text-xl font-bold text-gray-50">
            {firstGeoHistory && firstGeoHistory.query}
          </span>
          <span>
            ({geofenceCenter.lat}, {geofenceCenter.lon})
          </span>
        </div>
        <div className="w-[300px] rounded-lg h-[300px] shadow-lg flex flex-col items-center justify-center bg-purple-500">
          <span className="font-bold text-xl">Geofence Radius</span>

          <span className="text-6xl  font-bold text-white ">
            {firstGeoHistory && firstGeoHistory.radius}m
          </span>
        </div>
        <div className="w-[300px] rounded-lg h-[300px] shadow-lg flex flex-col items-center justify-center bg-[#29BF8C]">
          <span className="font-bold text-xl">Geofence Status</span>

          <span className="text-base lg:text-2xl font-bold text-white">
            {console.log(distance,"This is the distanceeee")}
            {longitude && latitude ? (
              distance <= (firstGeoHistory && firstGeoHistory.radius/1000) ? (
                "Inside Geofence"
              ) : (
                <span className="text-red-600">Outside Geofence</span>
              )
            ) : (
              "Loading..."
            )}
          </span>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default GeolocationComponent;
