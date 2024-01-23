import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.sendReply){
        handleSendReplyClick(e.target.dataset.sendReply)
    }
    else if(e.target.dataset.trash){
        handleTrashClick(e.target.dataset.trash)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

let newTweetsArray = []
const tweetsFromLocalStorage = JSON.parse(localStorage.getItem("newTweetsArray"))


// localStorage.clear()

if(tweetsFromLocalStorage){
    newTweetsArray = tweetsFromLocalStorage
    newTweetsArray.forEach(function(tweet){
    tweetsData.unshift(tweet)
    })
    render()
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        const tweetObj = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        }
        
    newTweetsArray.push(tweetObj)
    
    localStorage.setItem("newTweetsArray",JSON.stringify(newTweetsArray))
    
    tweetsData.unshift(tweetObj)
    
    render()
    tweetInput.value = ''
    }
}

function handleSendReplyClick(tweetID){
    const replyValue = document.getElementById(`reply-input-${tweetID}`).value
    
    if(replyValue){
         const replyObj = {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: replyValue
    }
    
        const tweetToBeReplied = tweetsData.filter(function(tweet){
            return tweet.uuid === tweetID
        })[0]
        
        tweetToBeReplied.replies.push(replyObj)
        render()
    } 
}

function handleTrashClick(tweetID){
    const tweetToBeDeleted = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetID
    })[0]
    
    
    delete tweetsData[tweetsData.indexOf(tweetToBeDeleted)]
    render()
}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                    `
            })
        }
        
    let deleteIcon = ''
    
    if(tweet.handle === '@Scrimba'){
        deleteIcon = `
            <span class="tweet-detail">
                <i class="fa-solid fa-trash"
                data-trash="${tweet.uuid}"
                ></i>
            </span>`
    }

          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                ${deleteIcon}
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
            <textarea placeholder="Add your comment" class="reply-input" id="reply-input-${tweet.uuid}"></textarea>
            <i class="fa-regular fa-paper-plane" data-send-reply="${tweet.uuid}"></i>      
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

