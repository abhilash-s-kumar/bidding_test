The public domain name is as follows:

https://bidding-test.onrender.com

The endpoints are as below:
----------------------------------------------------------------------------------------------------
/auth/customer_login(POST)

/auth/customer_register(POST)

----------------------------------------------------------------------------------------------------

/items/add_item(POST)

/items/disable_item(POST)

/items/get_items(GET)

/items/get_customer_items(GET)

/items/get_del_item(GET)

/items/get_auctioning_items(GET)

----------------------------------------------------------------------------------------------------

/file/upload(POST)

----------------------------------------------------------------------------------------------------

/category/add_category(POST)

/category/delete_category(POST)

/category/get_categories(GET)

----------------------------------------------------------------------------------------------------

All/any additional information about the endpoints are available along with their code in their respective files.
For the sake of this test application's functionality I have pushed the .env file into the project repository being aware of the security implications it represents.

Please note that the hosting service provider I used is render.com
as per their terms and conditions if no API calls are made in a while the service may go into standby mode and upto a 50 seconds delay may occur till the service come back online when a new API call is made.