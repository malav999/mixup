const dbConnection = require('../config/mongoConnection');
const mixup = require('../mixup/');
const song = mixup.song
const likesComments = mixup.likesComments
const playlist = mixup.playlist
const user = mixup.user

async function main() {
	const db = await dbConnection();
	// await db.dropDatabase();

	let youtubeSong1 = await song.addSongToYouTube("Addicted", "https://www.youtube.com/watch?v=2M-2BFS6Jxc", "2M-2BFS6Jxc", "youtube");
	const youtubeSong2 = await song.addSongToYouTube("All too well", "https://www.youtube.com/watch?v=Fd_AtH0yVqU", "Fd_AtH0yVqU", "youtube");
	const youtubeSong3 = await song.addSongToYouTube("Dear John", "https://www.youtube.com/watch?v=-CA9CvO87tI", "-CA9CvO87tI", "youtube");
	const youtubeSong4 = await song.addSongToYouTube("Here I am", "https://www.youtube.com/watch?v=FRUZ8ZK_p1A", "FRUZ8ZK_p1A", "youtube");
	const youtubeSong5 = await song.addSongToYouTube("Everything I do", "https://www.youtube.com/watch?v=Y0pdQU87dc8", "Y0pdQU87dc8", "youtube");
	const youtubeSong6 = await song.addSongToYouTube("Brazil la la la la la", "https://www.youtube.com/watch?v=VbXNmIvWa1c", "VbXNmIvWa1c", "youtube");
	const youtubeSong7 = await song.addSongToYouTube("Blue night", "https://www.youtube.com/watch?v=5sjWUy3EWNQ", "5sjWUy3EWNQ", "youtube");
	const youtubeSong8 = await song.addSongToYouTube("White horse", "https://www.youtube.com/watch?v=D1Xr-JFLxik", "D1Xr-JFLxik", "youtube");
	const youtubeSong9 = await song.addSongToYouTube("Nothing at all", "https://www.youtube.com/watch?v=7xrxrEEGVdM", "7xrxrEEGVdM", "youtube");
	const youtubeSong10 = await song.addSongToYouTube("Nothing gonna change my love", "https://www.youtube.com/watch?v=Tr97MQiqW38", "Tr97MQiqW38", "youtube");
	const youtubeSong11 = await song.addSongToYouTube("love will keep us alive", "https://www.youtube.com/watch?v=Kw2FVxSOhv4", "Kw2FVxSOhv4", "youtube");
	const youtubeSong12 = await song.addSongToYouTube("lome me like you do", "https://www.youtube.com/watch?v=bgjUzhdmmF0", "bgjUzhdmmF0", "youtube");
	const youtubeSong13 = await song.addSongToYouTube("she got her own thing that's why i love her lyrics ", "https://www.youtube.com/watch?v=9brRClzXLY0", "9brRClzXLY0", "youtube");
	const youtubeSong14 = await song.addSongToYouTube("lover", "https://www.youtube.com/watch?v=-BjZmE2gtdo", "BjZmE2gtdo", "youtube");
	const youtubeSong15 = await song.addSongToYouTube("love yourself", "https://www.youtube.com/watch?v=oyEuk8j8imI", "oyEuk8j8imI", "youtube");
	const youtubeSong16 = await song.addSongToYouTube("come and get it", "https://www.youtube.com/watch?v=n-D1EB74Ckg", "D1EB74Ckg", "youtube");
	const youtubeSong17 = await song.addSongToYouTube("Blank space", "https://www.youtube.com/watch?v=e-ORhEE9VVg", "ORhEE9VVg", "youtube");
	const youtubeSong18 = await song.addSongToYouTube("You belong with me", "https://www.youtube.com/watch?v=1WJpLpP-w2g", "1WJpLpP-w2g", "youtube");
	const youtubeSong19 = await song.addSongToYouTube("Hello", "https://www.youtube.com/watch?v=b_ILDFp5DGA", "b_ILDFp5DGA", "youtube");
	const youtubeSong20 = await song.addSongToYouTube("Crazier", "https://www.youtube.com/watch?v=B0p4Lv0t124", "B0p4Lv0t124", "youtube");

	let userMalavObj = {
		body: {
			firstName: 'malav',
			lastName: 'shah',
			email: 'malav@gmail.com',
			password: 'malav',
			age: 24
		}
	}

	let userMahirObj = {
		body: {
			firstName: 'Mahir',
			lastName: 'Dhall',
			email: 'mahir@gmail.com',
			password: 'mahir',
			age: 23
		}
	}

	let malav = await user.addUser(userMalavObj)
	let mahir = await user.addUser(userMahirObj)

	let mId = malav.user._id.toString()
	let mahirId = mahir.user._id.toString()

	let malavPlaylistObj = {
		session: {
			userId: mId
		},
		body: {
			playlistName: 'Bollywood Hits'
		}
	}
	const malavPlaylist = await playlist.createPlaylist(malavPlaylistObj)

	let pId = malavPlaylist._id.toString()
	let malavSongObj = {
		session: {
			playlistId: pId,
			userId: mId,
		},
		body: {
			songURI: youtubeSong1.songURI,
			songName: youtubeSong1.songName,
			platform: youtubeSong1.platform
		}
	}

	let malavSongObj2 = {
		session: {
			playlistId: pId,
			userId: mId,
		},
		body: {
			songURI: youtubeSong2.songURI,
			songName: youtubeSong2.songName,
			platform: youtubeSong2.platform
		}
	}

	let malavSongObj3 = {
		session: {
			playlistId: pId,
			userId: mId,
		},
		body: {
			songURI: youtubeSong3.songURI,
			songName: youtubeSong3.songName,
			platform: youtubeSong3.platform
		}
	}

	let malavSongObj4 = {
		session: {
			playlistId: pId,
			userId: mId,
		},
		body: {
			songURI: youtubeSong4.songURI,
			songName: youtubeSong4.songName,
			platform: youtubeSong4.platform
		}
	}

	await song.addSong(malavSongObj)
	await song.addSong(malavSongObj2)
	await song.addSong(malavSongObj3)
	await song.addSong(malavSongObj4)

	let malavLikeObj = {
		body: {
			playlistId: pId,
			userId: mId
		}
	}

	let malavLikes = await likesComments.addLike(malavLikeObj)

	let malavCommentsObj = {
		body: {
			playlistId: pId,
			userId: mahirId,
			userName: mahir.user.firstName,
			content: 'This playlist is amazing'
		}
	}

	let malavComments = await likesComments.addComment(malavCommentsObj)

	console.log('Done seeding database');
	await db.close();
}

main();
