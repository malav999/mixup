const dbConnection = require('../config/mongoConnection');
const mixup = require('../mixup/');
const song = mixup.song

async function main() {
	const db = await dbConnection();
	// await db.dropDatabase();

	const youtubeSong1 = await song.addSongToYouTube("Addicted", "https://www.youtube.com/watch?v=2M-2BFS6Jxc", "2M-2BFS6Jxc");
	const youtubeSong2 = await song.addSongToYouTube("All too well", "https://www.youtube.com/watch?v=Fd_AtH0yVqU", "Fd_AtH0yVqU");
	const youtubeSong3 = await song.addSongToYouTube("Dear John", "https://www.youtube.com/watch?v=-CA9CvO87tI", "-CA9CvO87tI");
	const youtubeSong4 = await song.addSongToYouTube("Here I am", "https://www.youtube.com/watch?v=FRUZ8ZK_p1A", "FRUZ8ZK_p1A");
	const youtubeSong5 = await song.addSongToYouTube("Everything I do", "https://www.youtube.com/watch?v=Y0pdQU87dc8", "Y0pdQU87dc8");
	const youtubeSong6 = await song.addSongToYouTube("Brazil la la la la la", "https://www.youtube.com/watch?v=VbXNmIvWa1c", "VbXNmIvWa1c");
	const youtubeSong7 = await song.addSongToYouTube("Blue night", "https://www.youtube.com/watch?v=5sjWUy3EWNQ", "5sjWUy3EWNQ");
	const youtubeSong8 = await song.addSongToYouTube("White horse", "https://www.youtube.com/watch?v=D1Xr-JFLxik", "D1Xr-JFLxik");
	const youtubeSong9 = await song.addSongToYouTube("Nothing at all", "https://www.youtube.com/watch?v=7xrxrEEGVdM", "7xrxrEEGVdM");
	const youtubeSong10 = await song.addSongToYouTube("Nothing gonna change my love", "https://www.youtube.com/watch?v=Tr97MQiqW38", "Tr97MQiqW38");
	const youtubeSong11 = await song.addSongToYouTube("love will keep us alive", "https://www.youtube.com/watch?v=Kw2FVxSOhv4", "Kw2FVxSOhv4");
	const youtubeSong12 = await song.addSongToYouTube("lome me like you do", "https://www.youtube.com/watch?v=bgjUzhdmmF0", "bgjUzhdmmF0");
	const youtubeSong13 = await song.addSongToYouTube("she got her own thing that's why i love her lyrics ", "https://www.youtube.com/watch?v=9brRClzXLY0", "9brRClzXLY0");
	const youtubeSong14 = await song.addSongToYouTube("lover", "https://www.youtube.com/watch?v=-BjZmE2gtdo", "BjZmE2gtdo");
	const youtubeSong15 = await song.addSongToYouTube("love yourself", "https://www.youtube.com/watch?v=oyEuk8j8imI", "oyEuk8j8imI");
	const youtubeSong16 = await song.addSongToYouTube("come and get it", "https://www.youtube.com/watch?v=n-D1EB74Ckg", "D1EB74Ckg");
	const youtubeSong17 = await song.addSongToYouTube("Blank space", "https://www.youtube.com/watch?v=e-ORhEE9VVg", "ORhEE9VVg");
	const youtubeSong18 = await song.addSongToYouTube("You belong with me", "https://www.youtube.com/watch?v=1WJpLpP-w2g", "1WJpLpP-w2g");
	const youtubeSong19 = await song.addSongToYouTube("Hello", "https://www.youtube.com/watch?v=b_ILDFp5DGA", "b_ILDFp5DGA");
	const youtubeSong20 = await song.addSongToYouTube("Crazier", "https://www.youtube.com/watch?v=B0p4Lv0t124", "B0p4Lv0t124");

	console.log('Done seeding database');
	await db.close();
}

main();
