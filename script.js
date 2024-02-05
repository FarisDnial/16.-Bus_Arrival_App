const busStopIdInput = document.getElementById("busStopId");
const arrivalInfo = document.getElementById("arrivalInfo");

let intervalId = null; // Declare intervalId outside the function

async function fetchBusArrival(busStopId) {
  const response = await fetch(`https://2t8td6-8080.csb.app/?id=${busStopId}`);
  if (response.ok){
    const arrivalData = await response.json();
    return arrivalData;
  } else {
    throw new Error("Error fetching bus arrival data.");
  }
}

function formatArrivalData(arrivalData) {
  const buses = arrivalData.services;
  const formattedData = [];
  const totalBuses = buses.length;

  for(const bus of buses) {
    // const arrivalTimeString = bus.next_bus_mins < 0 ? "Arriving" : `${bus.next_bus_mins} min(s)`;
    let arrivalTimeString;

    if (bus.next_bus_mins > 0) {
      arrivalTimeString = `${bus.next_bus_mins} min(s)`;
    } else {
      arrivalTimeString = "Arriving";
    }
    
    formattedData.push(`
          <div>
            <strong>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
          </div>`);
  }
  formattedData.push(`
          <div>
            <strong>Total Buses: ${totalBuses}</strong>
          </div>`);

  return formattedData.join("");
}
  
function displayBusArrival(busStopId) {
  // Clear previous interval when the user request new bus stop
  clearInterval(intervalId); 

  // Fetch bus arrival data initially
  fetchAndDisplay(busStopId);

  // Set interval to update every 15 seconds
  intervalId = setInterval(() => {
    fetchAndDisplay(busStopId);
  }, 15000);
}

function fetchAndDisplay(busStopId) {
  arrivalInfo.innerHTML = "Loading...";
  fetchBusArrival(busStopId)
    .then((arrivalData) => {
      const formattedArrivalData = formatArrivalData(arrivalData);
      arrivalInfo.innerHTML = formattedArrivalData;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getBusTiming() {
  const busStopId = busStopIdInput.value;
  displayBusArrival(busStopId);
}
