const express = require('express');
const router = express.Router();
const Lyrics = require('../models/lyrics')
const Singers = require('../models/singers')

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info.lyricstogether@gmail.com',
    pass: 'Rajat@123'
  }
});



router.get('/', (req,res,next) => {
    res.redirect('/home');
})

router.get('/home', async (req,res,next) => {

    let hindi = await Lyrics.find({'Language': 'Hindi'}).sort([['createdAt', -1]]).limit(5);
    let punjabi = await Lyrics.find({'Language': 'Punjabi'}).sort([['createdAt', -1]]).limit(5);
    
    let all = [...hindi, ...punjabi]
    all = all.sort(() => Math.random() - 0.5)
    

    res.render('pages/home', {
        'title': 'Lyrics Together',
        'pageTitle': 'Home- Lyrics Together',
        'keywords': 'lyricstogether.com,lyrics lyricstogether, lyricstogether , lyrics search, songs words, azlyrics, lyric, youtube, free mp3 , music, free mp3 downloads, mp3, musica, youtube music, music downloader, song, mp3 download, play music,downlaod music, latest songs, song lyrics, free ,punjabi song lyrics, hindi song lyrics, hindi lyrics, punjabi lyrics, latest hindi song, latest punjabi song, latest song lyrics',
        'description': 'Lyrics Together is providing latest song lyrics.',
        'hindi': hindi,
        'punjabi': punjabi,
        'all': all

    })
})


router.get('/contact', (req,res,next) => {
    res.render('pages/contact', {
        'title': 'lyricstogether contact',
        'pageTitle': 'Contact - Lyrics Together',
        'keywords': 'contact ',
        'description': 'You can contact lyrics together about any query here'  
    })
})


router.get('/songs', (req,res,next) => {
    res.redirect('/')
})


router.post('/search', async(req,res,next) => {
    let song = req.body.song;

    let search = {$regex: new RegExp(song, "ig")}
    

    let songs = await Lyrics.find(
        { $or: [
            { 'Title': search },
            {'Director': search},
            {'Music': search},
            {'Music Label': search},
            {'Lyricist': search},
            {'Lyrics': search},
            {'Album': search}
        ]}
    ).limit(20)


    res.render('pages/search', {
        
        'pageTitle': 'Search',
        'title': '',
        'keywords': "",
        'description': '',
        'songs' :songs,
    })

})




router.get('/songs/:id', (req,res,next) => {
    let id = req.params.id;
    res.redirect('/songs/'+ id+ '/1')
})

router.get('/songs/:id/:page', async(req,res,next) => {
    let id = req.params.id;
    let page = req.params.page;
    let limit = page * 10;
    let skip = limit - 10

    let language = id.charAt(0).toUpperCase() + id.slice(1);
    let songs = await Lyrics.find({'Language': language}).sort([['createdAt' , -1]]).skip(skip).limit(10)
    
    res.render('pages/category', {
        'title':  id + ' songs- Lyrics Together',
        'pageTitle': id +' Songs',
        'keywords': `lyricstogether.com, lyrics lyricstogether ,latest ${id} songs, ${id} songs lyrics, new ${id} songs`,
        'description': 'Lyrics Together is providing Latest '+ id +' lyrics.',
        'language': id,
        'songs' :songs,
        'page': parseInt(page),
    })
})


router.get('/lyrics/:id', async(req,res,next) => {

    let id = req.params.id
    let song = await Lyrics.findById(id);

    let keywords = '';
    keywords += song.Title +"-"+ song.Singer;

    let title = song.Title.replace(' Lyrics', '');
    keywords += ', '+ title + ' song, ' +', ' + title + ' song lyrics,' 
    keywords += ' lyricstogether.com'

    
    res.render('pages/lyrics', {
        'title': song.Title + ' Lyrics Together',
        'keywords': keywords.toLowerCase(),
        'description': `${song.Title} - by ${song.Singer} | music ${song.Music} | lyricst ${song.Lyricist} ...`,
        'song': song,
        'pageTitle': song.Title + '-' + song.Singer

    })
})

router.get('/singers/:name', async(req,res,next) => {
    let name = req.params.name;
    
    let singers = await Singers.find({'name': new RegExp("^"+ name.toUpperCase())})
    
    res.render('pages/singers', {
        'title':  ' singers - Lyrics Together',
        'pageTitle': 'Singers ',
        'keywords': `lyricstogether.com, singer, ${name} singers list`,
        'description': 'find songs by singer name on lyricstogether.com',
        'singers' :singers,
    })
})

router.get('/singer/:name', async(req,res,next) => {
    let name = req.params.name;
    
    let songs = await Lyrics.find({'Singer':  {$regex: new RegExp(name, "ig") }}).sort([['createdAt' , -1]])
    
    res.render('pages/search', {
        
        'pageTitle': 'Search Result - ' + name,
        'title': `${name} songs`,
        'keywords': `${name}, singers`,
        'description': '',
        'songs' :songs,
    })
})



router.post('/contact', (req,res,next) => {

    let name = req.body.name;
    email = req.body.email;
    message = req.body.message;


    var mailOptions = {
        from: 'info.lyricstogether@gmail.com',
        to: 'info.lyricstogether@gmail.com',
        subject: 'New Quote',
        html: `
            name : ${name}<br>
            email: ${email} <br>
            message: ${message}
        `
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
          return res.render('/bad-request')
        } else {
            return res.redirect('/contact')
        }
      });
})


module.exports = router;
