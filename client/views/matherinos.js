function findDistance(lat1, lng1, lat2, lng2) {
	var dlon = lon2 - lon1;
	var dlat = lat2 - lat1;
	var a = (Math.pow(Math.sin((dlat/2))), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow((Math.sin(dlon/2)),2);
	var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a));
	var d = (6371 * c) * 1000;
	return d;
}