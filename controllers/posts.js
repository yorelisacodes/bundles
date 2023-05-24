const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");
const { sendEmail } = require("../services/nodemailer");
// STRIPE PAYMENT  =============

const stripe = require("stripe")(process.env.STRIPE_KEY)

module.exports = {
  getProfile: async (req, res) => {
    try {
      if (req.user.userType === 'seller') {
        console.log('its a seller')
        res.redirect('/seller')
      }
      const bundles = await Post.find();
      res.render("buyer.ejs", { bundles, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getHistory: async (req, res) => {
    try {
      const history = await Post.find({ purchasedBy: req.user.email });
      res.render("history.ejs", { history, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getChat: async (req, res) => {
    try {
      const users = await User.find();
      const sellers = users.filter((user) => user.userType === 'seller')
      res.render("chatHome.ejs", {
        user: req.user.email,
        sellers,
      });
    } catch (err) {
      console.log(err);
    }
  },
  startChat: async (req, res) => {
    try {
      console.log(req.params)
      res.render("chatRoom.ejs");
    } catch (err) {
      console.log(err);
    }
  },
  getSellerProfile: async (req, res) => {
    try {
      const bundles = await Post.find();
      console.log({ bundles }, 'for seller')
      res.render("seller.ejs", { bundles, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    try {
      const favorites = await Post.find({ savedBy: req.user.email }).sort({ createdAt: "desc" }).lean();
      res.render("favorites.ejs", { favorites, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getCart: async (req, res) => {
    console.log('cart1')
    try {
      const cartIds = req.user.cart
      const cart = []
      for (let i = 0; i < cartIds.length; i++) {
        console.log('cart2')
        cart.push(await Post.findById(cartIds[i]))
        console.log('cart3')

        console.log(cartIds)
      }

      let total = 0
      for (let i = 0; i < cart.length; i++) {
        total += parseFloat(cart[i].price.replace('$', ''))
      }

      res.render("cart.ejs", { cart, total, user: req.user })
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createBundle: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const date = new Date().toLocaleDateString()
      console.log(req.bod)
      await Post.create({
        price: req.body.price,
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        description: req.body.description,
        location: req.body.location,
        seller: req.user.email,
        date,
        saved: false,
        savedBy: null,
        purchased: false,
        purchasedBy: null,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  saveBundle: async (req, res) => {
    console.log(req.params)
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { 
            saved: true,
            savedBy: req.user.email
           },
        }
      );
      console.log("we saved the bundle");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },

  addToCart: async (req, res) => {
    console.log(req.params)
    try {
      req.user.cart.push(req.params.id)
      req.user.save()
      console.log("we saved the bundle");
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteFromCart: async (req, res) => {
    try {
      const index = req.user.cart.indexOf(req.params.id); // Find the index of the id in the cart array

      if (index !== -1) { // If the id exists in the cart array
        req.user.cart.splice(index, 1); // Remove 1 element at the found index
        req.user.save()
      }
      res.redirect('/post/getCart')

    } catch (err) {
      console.log(err);
    }
  },
  purchaseBundle: async (req, res) => {
    console.log('trying to purchase...')
    console.log(req.params, req.user.id)
    try {
      const bundle = await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            purchased: true,
            purchasedBy: req.user.email
          },
        }
      );

      sendEmail({
        email: bundle.seller,
        subject: `Congrats, you sold ${bundle.title}!`,
        text: `Hello! You just sold your ${bundle.title} for ${bundle.price}. You will receive an email confirmation once the purchaser has checked out with Stripe.`
      })
      console.log("we purchased the bundle", bundle);
      res.redirect(`/profile`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
     
      await Post.remove( {_id: req.params.id} );
     
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  getSuccess: async (req, res) => {
    try {
      res.redirect('/success')
    } catch (err) {
      console.log(err);
    }
  },
  getCancel: async (req, res) => {
    try {
      res.redirect('/cancel')
    } catch (err) {
      console.log(err);
    }
  },




  createCheckoutSession: async (req, res) => {
    const stripePriceIds = ['price_1NAOMvJfVW8DDLf3fjDPcrrw', "price_1NAOP9JfVW8DDLf3xd1728g1", "price_1NAP3KJfVW8DDLf3eVrxZ6gg"]
    try {


      const bundles = await Post.find({ _id: { $in: req.user.cart } });

      const lineItems = bundles.map((bundle, i) => {
        console.log(bundle, i)
        const priceIndex = Math.floor(parseInt(bundle.price.replace('$', '')) / 10) - 1
        let price
        if (priceIndex >= stripePriceIds.length) {
          price = stripePriceIds[stripePriceIds.length - 1]
        } else {
          price = stripePriceIds[priceIndex]
        }
        return { price: price, quantity: 1 }

      })

      console.log(lineItems)
      console.log(req.body)
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,

        mode: "payment",
        success_url: `${process.env.SERVER_URL}/success`,
        cancel_url: `${process.env.SERVER_URL}/cancel`,
      });

      res.redirect(303, session.url);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "An error occurred" });
    }
  }

};


