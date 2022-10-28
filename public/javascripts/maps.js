mapboxgl.accessToken = mapToken
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: Campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    })

    new mapboxgl.Marker({ color: 'red'})
    .setLngLat(Campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25})
        .setHTML(
            `<h4>${Campground.title}</h4>`
        )
    )
    .addTo(map);