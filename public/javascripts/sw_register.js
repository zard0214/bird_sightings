if ('serviceWorker' in navigator) {
	//register a service worker
	navigator.serviceWorker.register("/javascripts/sw_register.js")
		.then(registration => {
			console.log("Service Worker registered", registration)
		})
		.catch(err => {
			console.error("Failed to register Service Worker", err)
		})
}