class StripeController < ApplicationController
Stripe.api_key = ENV["STRIPE_KEY"]

    def get_customer_invoice_items
        customer = params["user"]["stripe_id"]
        invoice_items = []
        if customer && customer.length > 1
            begin
            invoice_items = Stripe::InvoiceItem.list(customer: params["user"]["stripe_id"], pending: true)
            rescue
            end
        end
        render json: {invoice_items: invoice_items}
    end

    def get_customer_invoices 
        customer = params["user"]["stripe_id"]
        invoices = nil
        status = params["invoice_status"]
        if customer && customer.length > 1
            begin
            invoices = Stripe::Invoice.list(customer: params["user"]["stripe_id"], status: status)
            rescue 
            end
        end
        render json: {invoices: invoices}
    end

    def update_invoice_item
        item = params["invoice_item"]
        updated_item = Stripe::InvoiceItem.update( item["id"],{ amount: item["amount"], description: item["description"]})
        render json: {updated_item: updated_item}
    end

    def delete_invoice_item
        item = params["invoice_item"]
        deleted_item = Stripe::InvoiceItem.delete(item["id"])
        render json: {deleted_item: deleted_item}
    end

    


    def create_invoice_item
        user = User.find(params["user"]["id"])
        stripe_id = params["user"]["stripe_id"]
        event = params["event"]
        dateString =  DateTime.parse(event["start_time"])
        description = "#{dateString.day}/#{dateString.month}/#{dateString.year} Supervision"

        if stripe_id == nil || stripe_id.length < 1
            Stripe.api_key = ENV["STRIPE_KEY"]
            customer =  Stripe::Customer.create({
            name: user.first_name + " " + user.last_name,
            email: user.email,
            phone: user.phone_number
            })
            user.update(stripe_id: customer.id)
        end
        begin
            invoice_item = Stripe::InvoiceItem.create({
                customer: user.stripe_id,
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
        rescue
            puts "invoice item creation error"
        end
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

    def mark_invoice_as_paid
        invoice_id = params["invoice"]["id"]
        invoice = Stripe::Invoice.pay(invoice_id,  {paid_out_of_band: true})
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


end
