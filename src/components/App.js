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
      currentSku: 510121,
      currentRating: 2.75
    };
    this.getAllReviews = this.getAllReviews.bind(this);
    this.averageStars = this.averageStars.bind(this);
  }

  componentDidMount() {
    this.getAllReviews();
  }

  // componentDidUpdate(prevState) {
  //   if (this.state.currentRating !== prevState.currentRating) {
  //     this.averageStars(this.state.reviews, this.state.currentSku)
  //   }
  // }

  // TODO: find a way to update current sku on get
  // function used to update all reviews
  getAllReviews() {
    axios.get('http://localhost:9004/reviews')
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
     this.setState({ currentRating: results});
  }

  render() {
    return (
      <div className='entireRender'>
        <button className='reviewButton' onClick={() => this.averageStars(this.state.reviews, this.state.currentSku)}>
          <span className='btnReview'><h1 >Reviews</h1>
          </span>
            <span className='btnStars'><StarRatings
            starDimension='30px'
            rating={this.state.currentRating}
            starRatedColor='yellow' numberOfStars={5}
            starSpacing='0px'
            /> ({this.state.reviews.length})
            </span>
        </button>
        <RatingMargin
        reviews={this.state.reviews}
        length={this.state.reviews.length}
        rating={this.state.currentRating}
        sku={this.state.currentSku}
        />
          <ReviewList rating={this.state.currentRating}
          reviews={this.state.reviews}
          product={this.state.currentSku}
          />
      </div>
    );
  }
}
