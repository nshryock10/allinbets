import React from 'react';
import './PaymentPolicy.css';

function PaymentPolicy() {

  return (
    <div className="policy-container">
        <div>
            <h1>Payment allotment and Scoring</h1>
            <h2>Payout Structure</h2>
            <p>
                The total pot is based on the total number of users who sign up to play before the games start. Of the total buy-in collected
                85% goes to the pot which will be distributed to the winners. Below is our payout structure:
                <br/><br/>
                1st place: 60% of the pot
                <br/><br/>
                2nd place: 30% of the pot
                <br/><br/>
                3rd place: 10% of the pot
                <br/><br/>
                See "Scoring and Tie Breaker" for how the winners are determined.
            </p>
            <br/>
            <h2>Scoring and Tie Breakers</h2>
            <p>
                Each question answered is equally weighted and worth 1 point, except for the tie breaker question. The tie breaker question 
                is worth 3 points if answered correctly.
                <br/><br/>
                Users are first ranked by total points scored. If there is a tie in total points scored, the user with the closest total value,
                over or under, the final answer of the tie breaker is ranked above the other users. If there is still a tie in the tie breaking answer
                the users in the final tie split the payout for the tiers of the total tied users.
                <br/><br/>
                Example 1: 2-way tie for 1st place, the 1st and 2nd place payout are split equally to the top two users. The next highest user is awarded the 3rd place 
                payout.
                <br/><br/>
                Example 2: No tie for first place, but 3 way tie for second. The top ranked user is awarded the first place payout and tied next 3 users
                split the combined payout for 2nd and 3rd place. 
            </p>
            <br/>
            <h2>Distribution of Buy In</h2>
            <p>
                For the $10.00 buy-in in these games, 85% goes directly to the pot and its split up amongst the winners. See below for 
                our payout structure. <br/><br/>We belive that while having a good time playing these games, we can do some good with our money 
                which is why 10% of the pot will be donated to charity. The charity we are donating back to will be the Innocence Project
                which works to free the innocent, prevent wrongful convictions, and create fair, compassionate, and equitable systems of 
                justice for everyone.  <br/><br/> The last 5% of the buy in goes to supporting the development and overhead for keeping this website
                running. We greatly appreciate your support and your continued use of these games.
            </p>
            <br/>
            <h2>Taxes and Fees</h2>
            <p>
                In addition to the buy in fee, we also charge taxes, processing feeing, and hosting fees. In order to remain compliant with 
                US sales tax policies, we charge a sales tax on the buy in fee. <br/> <br/>For the best user experience we utilize a secure payment 
                transaction through PayPal. PayPal charges a flat fee per transaction, plus a percentage of each transaction. This additional fee
                ensures your information is not shared with outside parties and your payout can be quickly distributed. <br/><br/> Lastly, in order to provide
                this website we charge a hosting fee. This fees allows us to use a third-party hosting service so we can focus on bringing you the 
                best user experience. 
            </p>
        </div>
    </div>
    
  );
}

export default PaymentPolicy;