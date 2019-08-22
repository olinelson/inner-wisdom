class StripeController < ApplicationController
Stripe.api_key = 'sk_test_leD90Sq6bZqN5loAEFF3XxBt00VD4BmzYE'


# # charge = Stripe::Charge.create({
# #     amount: 999,
# #     currency: 'usd',
# #     source: 'tok_visa',
# #     receipt_email: 'jenny.rosen@example.com',
# # })

# # customer = Stripe::Customer.create({
# #   id: "5",
# #   name: "Oli admin Nelson",
# #   email: 'olinelson93@gmail.com',
# # })

Stripe::InvoiceItem.create({
  customer: "5",
  amount: 2500,
  currency: 'aud',
  description: 'One-time setup fee',
})




# inv = Stripe::Invoice.create({
#     customer: '4',
#     collection_method: 'send_invoice',
#     days_until_due: 7
# })


# invoice = Stripe::Invoice.finalize_invoice('in_1FA39qCk9T3T1VFkk4T6FQg9')

# invoice = Stripe::Invoice.send_invoice('in_1FA1vgCk9T3T1VFkpS7PVuA1')



# byebug




# invs = Stripe::Invoice.list(limit: 3)

# in_1FA1vgCk9T3T1VFkpS7PVuA1

# invoice = Stripe::Invoice.send_invoice('in_1FA1vgCk9T3T1VFkpS7PVuA1')

def create_invoice_item(userId, ammount, description)
    user = User.find(userId)

    Stripe::InvoiceItem.create({
        customer: user.stripe_id,
        amount: ammount,
        currency: "aud",
        description: description,
    })
end

def create_and_send_invoice(userId)
    user = User.find(userId)

    inv = Stripe::Invoice.create({
    customer: user.stripe_id,
    collection_method: 'send_invoice',
    days_until_due: 7
    })

    Stripe::Invoice.send_invoice(inv.id)
end

def create_customer
    byebug

    
    customer =  Stripe::Customer.create({
    name: user.first_name + " " + user.last_name,
    email: user.email,
    phone: user.phone_number
    })

    if customer.id
        user.update(stripe_id: customer.id)
    end

end


end
