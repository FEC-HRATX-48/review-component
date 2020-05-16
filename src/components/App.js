import React, { Component } from "react";
import axios from 'axios';
import Rating from './Rating.js';
import StarRatings from 'react-star-ratings';
import ReviewList from './ReviewList.js';
import RatingMargin from './RatingMargin.js';


export default class App extends Component {
  constructor() {
    super();
    this.state = {
      reviews: [],
      currentSku: 125613,
      currentRating: 1,
      hasClicked: false
    };
    this.getAllReviews = this.getAllReviews.bind(this);
    this.averageStars = this.averageStars.bind(this);
    this.showContent = this.showContent.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getAllReviews();
  }


  // TODO: find a way to update current sku on get
  // function used to update all reviews
  getAllReviews() {
    axios.get('http://worstbuyreviews-env-1.eba-miqf8zef.us-east-2.elasticbeanstalk.com/reviews')
    .then(res => {
      const reviews = res.data;
      this.setState({reviews})
    })
    .catch(err => {
      if (err) {
        console.log(err);
        console.log(err.message);
      }
    })
  }

  averageStars(reviews, sku) {
    let skuArray = [];
    reviews.map((item) => {
      if (item.product_sku === sku) {
        skuArray.push(item.star_rating)
      }
    })
    let total = skuArray.reduce((a, b) => a + b);
    let results = total / skuArray.length;
    this.setState({ currentRating: Math.round(10*results)/10});
  }

  showContent(e) {
    this.setState({hasClicked: !this.state.hasClicked})
  }

  handleClick() {
    this.averageStars(this.state.reviews, this.state.currentSku);
    this.showContent();
  }

  render() {
    return (
      <div className='entireRender'>
        <button className='reviewButton' onClick={() => this.handleClick()}>
          <span className='btnReview'><h1 >Reviews</h1>
          </span>
          {!this.state.hasClicked && <span className='btnStars'><StarRatings
            starDimension='30px'
            rating={this.state.currentRating}
            starRatedColor='yellow' numberOfStars={5}
            starSpacing='0px'
            /> ({this.state.reviews.length})
          </span>}

          {this.state.hasClicked ? <img id="closedChevron" src="./open chevron.png"></img> : <img id="chevron"  src="./open chevron.png"></img>}

        </button>
        {this.state.hasClicked && <RatingMargin
          reviews={this.state.reviews}
          length={this.state.reviews.length}
          rating={this.state.currentRating}
          sku={this.state.currentSku}
        />}

        {this.state.hasClicked && <ReviewList
          rating={this.state.currentRating}
          reviews={this.state.reviews}
          product={this.state.currentSku}
        />}
        <img src="https://worstbuy.s3.us-east-2.amazonaws.com/footer.png" 
                className="footerpos" />
      </div>
    );
  }
}
