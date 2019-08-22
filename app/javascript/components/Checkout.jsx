// import React from 'react'

// export default class Checkout extends React.Component {
//     // onToken = (token, addresses) => {
//     //     // TODO: Send the token information and any other
//     //     // relevant information to your payment process
//     //     // server, wait for the response, and update the UI
//     //     // accordingly. How this is done is up to you. Using
//     //     // XHR, fetch, or a GraphQL mutation is typical.
//     //     // alert(JSON.stringify(token))
//     //     // this.props.onToken(token, addresses)

//     //     this.props.onToken()
//     // };



//     render() {

//         return (
//             <StripeCheckout
//                 stripeKey={process.env.STRIPE_KEY}
//                 token={this.onToken}
//                 amount={this.props.ammount}
//                 email={this.props.email}
//                 // billingAddress
//                 // description="1 Session"
//                 // image="https://yourdomain.tld/images/logo.svg"
//                 locale="auto"
//                 name="innerwisdom.com"
//                 token={this.props.onToken}
//                 // zipCode
//                 data-currency={"aud"}
//             />
//         )
//     }
// }