// http://localhost:1337/api/devices?populate[tests][populate][0]=locations

function deviceHtml(test) {
  console.log('the test', test);
  return `
    PM10 : ${test.attributes.Test1}<br/>
    NITROGEN DIOXIDE: ${test.attributes.Test2}<br/>
    CARBON MONOXIDE: ${test.attributes.Test3}<br/>
    Date of tests: ${new Date(test.attributes.Timestamp).toLocaleString()}<br/>
    Location: ${test.attributes.locations.data[0].attributes.Location}<br/>
    View in map : <a href="https://www.google.com/maps/search/?api=1&query=${
      test.attributes.locations.data[0].attributes.Latitude
    },${
    test.attributes.locations.data[0].attributes.Longitude
  }">Google Maps</a><br/>
    Start: ${new Date(test.attributes.Start).toLocaleString()}<br/>
    End: ${new Date(test.attributes.End).toLocaleString()}<br/>
    `;
}

function deviceDisplay(device) {
  const el = document.createElement('div');
  el.innerHTML = `
    Device ID: ${device.id}<br/>
    Battery level : ${device.attributes.Battery}<br/>
    Start time : ${new Date(device.attributes.Timestamp).toLocaleString()}<br/>
    Out of order: ${device.attributes.OutOfOrder ? 'Yes' : 'No'}<br/>
    ${device.attributes.tests.data.map((d) => deviceHtml(d)).join('<br/>')}
    `;
  el.className = 'device-card card';
  return el;
}

async function getDevices() {
  const response = await fetch(
    'http://localhost:1337/api/devices?populate[tests][populate][0]=locations',
  );
  const result = await response.json();
  const devices = result.data;
  console.log(devices);

  const cards = document.getElementById('cards');
  devices.forEach((d) => cards.append(deviceDisplay(d)));
}

getDevices();

// LOG IN FUNCTION

const loginButton = document.getElementById('login');
console.log('the login button', loginButton);
loginButton.addEventListener('onclick', logIn);

async function logIn() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const reply = await fetch('/api/auth/local/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier: username,
      password: password,
    }),
  });
  const output = await reply.json();
  console.log('the result of LOG-IN', output);
  await getDevices();
}

// CAROUSEL IMAGES

// Select all slides
const slides = document.querySelectorAll('.slide');

// loop through slides
slides.forEach((slide, indx) => {
  slide.style.transform = `translateX(${indx * 100}%)`;
});
