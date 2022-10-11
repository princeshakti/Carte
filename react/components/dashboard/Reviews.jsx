import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from 'react-rating';
function Body() {
    return (
        <Card>
            <Card.Body>
                <h4 className="header-title">My Reviews</h4>
                <br />
                <h4 className="header-title">Chipotle</h4>
                <p className="text-muted font-14">
                    On a hot summer day, its nice to find an indoor spot to eat! We decided to grab a quick bite at
                    Chipotle! The two chicken bowls that we ordered were large portions. The service was quick despite
                    it being busy! The chips added a nice crunch to the meal. Overall, it was a good meal for a decent
                    price!
                </p>

                <Rating
                    initialRating={3}
                    emptySymbol="mdi mdi-star-outline font-22 text-muted"
                    fullSymbol="mdi mdi-star font-22 text-warning"
                />
            </Card.Body>
            <Card.Body>
                <h4 className="header-title">Starbucks</h4>
                <p className="text-muted font-14">
                    The crew at this Starbucks is awesome shout out to Michelle. She puts cute messages on my drinks.
                    The store is always clean and they are the only location that always has my matcha latte.
                </p>

                <Rating
                    initialRating={4}
                    emptySymbol="mdi mdi-star-outline font-22 text-muted"
                    fullSymbol="mdi mdi-star font-22 text-warning"
                />
            </Card.Body>
            <Card.Body>
                <h4 className="header-title">Taco Bell</h4>
                <p className="text-muted font-14">
                    Pretty good Taco Bell. Food comes out fast and hot. Drive thru moves. Burritos are not
                    taquito-sized. Price is decent. Courteous employees. One of my regular Bells that I visit; I have no
                    complaints about this particular one, so keep up the good work!
                </p>

                <Rating
                    initialRating={3}
                    emptySymbol="mdi mdi-star-outline font-22 text-muted"
                    fullSymbol="mdi mdi-star font-22 text-warning"
                />
            </Card.Body>
        </Card>
    );
}

export default Body;
