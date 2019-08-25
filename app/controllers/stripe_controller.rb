class StripeController < ApplicationController
Stripe.api_key = ENV["STRIPE_KEY"]

def get_customer_invoice_items
    invoice_items = Stripe::InvoiceItem.list(customer: params["user"]["stripe_id"], pending: true)
    render json: {invoice_items: invoice_items}
end

def get_customer_invoices 
    invoices = Stripe::Invoice.list(customer: params["user"]["stripe_id"])
    render json: {invoices: invoices}
end

def update_invoice_item
    item = params["invoice_item"]
    updated_item = Stripe::InvoiceItem.update( item["id"],{ amount: item["amount"]})
    render json: {updated_item: updated_item}
end

def delete_invoice_item
    item = params["invoice_item"]
    deleted_item = Stripe::InvoiceItem.delete(item["id"])
    render json: {deleted_item: deleted_item}
end

def create_invoice_item
    stripe_id = params["user"]["stripe_id"]
    event = params["event"]
    # stripe_id = params["user"]["stripe_id"]
    dateString =  DateTime.parse(event["start_time"])
    description = "#{dateString.day}/#{dateString.month}/#{dateString.year} Appointment"



    invoice_item = Stripe::InvoiceItem.create({
        customer: stripe_id,
        amount: 0,
        currency: 'aud',
        description: description,
        metadata: {
                    type: "Appointment",
                    google_event_id: event["id"],
                    start_time: event["start_time"],   
                    end_time: event["end_time"],
                }
    })
    render json: { invoice_item: invoice_item }
end

def create_invoice
    stripe_id = params["user"]["stripe_id"]
    invoice = Stripe::Invoice.create({customer: stripe_id, collection_method: "send_invoice", days_until_due: 7})
    render json: {invoice: invoice}
end

def void_invoice
    invoice_id = params["invoice"]["id"]
    invoice = Stripe::Invoice.void_invoice(invoice_id)
    render json: {invoice: invoice}
end

def send_invoice
    invoice_id = params["invoice"]["id"]
    invoice = Stripe::Invoice.send_invoice(invoice_id)
    render json: {invoice: invoice}
end

def delete_draft_invoice

    invoice_id = params["invoice"]["id"]
    invoice = Stripe::Invoice.delete(invoice_id)
    render json: {invoice: invoice}
end

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

# def create_invoice_item(userId, ammount, description)
#     user = User.find(userId)

#     Stripe::InvoiceItem.create({
#         customer: user.stripe_id,
#         amount: ammount,
#         currency: "aud",
#         description: description,
#     })
# end

# def create_and_send_invoice(userId)
#     user = User.find(userId)

#     inv = Stripe::Invoice.create({
#     customer: user.stripe_id,
#     collection_method: 'send_invoice',
#     days_until_due: 7
#     })

#     Stripe::Invoice.send_invoice(inv.id)
# end

# def create_customer
#     byebug

    
#     customer =  Stripe::Customer.create({
#     name: user.first_name + " " + user.last_name,
#     email: user.email,
#     phone: user.phone_number
#     })

#     if customer.id
#         user.update(stripe_id: customer.id)
#     end

# end


end
