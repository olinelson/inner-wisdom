# # This file should contain all the record creation needed to seed the database with its default values.
# # The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
# #
# # Examples:
# #
# #   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
# #   Character.create(name: 'Luke', movie: movies.first)
# Stripe.api_key = 'sk_test_leD90Sq6bZqN5loAEFF3XxBt00VD4BmzYE'


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

# # Stripe::InvoiceItem.create({
# #   customer: "5",
# #   amount: 2500,
# #   currency: 'aud',
# #   description: 'One-time setup fee',
# # })

# Stripe::InvoiceItem.create({
#   customer: '4',
#   amount: 2500,
#   currency: 'aud',
#   description: 'Three times is a charm',
# })


# inv = Stripe::Invoice.create({
#     customer: '4',
#     collection_method: 'send_invoice',
#     days_until_due: 7
# })


# invoice = Stripe::Invoice.finalize_invoice('in_1FA39qCk9T3T1VFkk4T6FQg9')

# invoice = Stripe::Invoice.send_invoice('in_1FA1vgCk9T3T1VFkpS7PVuA1')



# byebug


# byebug

