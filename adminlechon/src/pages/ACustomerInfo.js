import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ACustomerInfo() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    customerid: '',
    name: '',
    address: '',
    contactNumber: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);



  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth');
        if (!response.data.isAuthenticated) {
          router.push('/');
        } else {
          fetchCustomers();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);


  

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/acustomer');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      await axios.post('/api/acustomer', newCustomer);
      await fetchCustomers();
      setNewCustomer({ customerid: '', name: '', address: '', contactNumber: '' });
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/acustomer/${newCustomer.customerid}`, newCustomer);
      await fetchCustomers();
      setNewCustomer({ customerid: '', name: '', address: '', contactNumber: '' });
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/acustomer/${id}`);
      await fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleEditClick = (customer) => {
    setNewCustomer(customer);
    setIsUpdating(true);
  };

  const handleCancelUpdate = () => {
    setNewCustomer({ customerid: '', name: '', address: '', contactNumber: '' });
    setIsUpdating(false);
  };




  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };



  return (
    <div className="flex h-screen">
      <aside className="bg-gray-800 w-1/4 text-white p-4">
        <div className="flex flex-col items-center">
          <FaUserCircle className="w-16 h-16 text-white" />
          <h2 className="mt-2">Admin</h2>
        </div>
        <nav className="mt-4">
          <Link href="/AProduct"><button className="w-full text-left p-2">Products</button></Link>
          <Link href="/AStaff"><button className="w-full text-left p-2">Staff</button></Link>
          <Link href="/ACustomerInfo"><button className="w-full text-left p-2 bg-red-700">Customer's Info</button></Link>
          <Link href="/AInventory"><button className="w-full text-left p-2">Inventory</button></Link>
          <Link href="/AOrders"><button className="w-full text-left p-2">Orders</button></Link>
          <Link href="/ADelivery"><button className="w-full text-left p-2">Delivery</button></Link>
          <Link href="/APayment"><button className="w-full text-left p-2">Payment</button></Link>
        </nav>
        <div className="mt-auto">
        <button onClick={handleLogout} className="w-full text-left p-2 bg-red-500 text-white rounded">
  Logout
</button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-200 p-6 overflow-y-auto">
        <h1 className="text-2xl text-black font-bold mb-4">Customer's Info</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full bg-white mb-4">
                <thead className="sticky top-0 bg-red-700 text-white">
                  <tr>
                    <th className="p-2">CustomerID</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Address</th>
                    <th className="p-2">Contact Number</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.customerid}>
                      <td className="p-2 text-black border">{customer.customerid}</td>
                      <td className="p-2 text-black border">{customer.name}</td>
                      <td className="p-2 text-black border">{customer.address}</td>
                      <td className="p-2 text-black border">{customer.contactNumber}</td>
                      <td className="p-2 text-black border">
                        <button
                          className="bg-blue-500 text-white p-1 mr-2 rounded"
                          onClick={() => handleEditClick(customer)}
                        >
                          Update
                        </button>
                        <button
                          className="bg-red-500 text-white p-1 rounded"
                          onClick={() => handleDelete(customer.customerid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2 className="text-xl text-black font-bold mb-4 mt-6">
          {isUpdating ? 'Update Customer' : 'Add New Customer'}
        </h2>
        <form className="bg-white text-black p-4 rounded-lg shadow-md space-y-4">
          <input
            type="text"
            name="customerid"
            value={newCustomer.customerid}
            onChange={handleInputChange}
            placeholder="CustomerID"
            className="w-full p-2 border"
            disabled={isUpdating}
          />
          <input
            type="text"
            name="name"
            value={newCustomer.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="w-full p-2 border"
          />
          <input
            type="text"
            name="address"
            value={newCustomer.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full p-2 border"
          />
          <input
            type="text"
            name="contactNumber"
            value={newCustomer.contactNumber}
            onChange={handleInputChange}
            placeholder="Contact Number"
            className="w-full p-2 border"
          />
          <div className="flex justify-end space-x-4">
            {isUpdating ? (
              <>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelUpdate}
                  className="bg-gray-500 text-white p-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="bg-green-500 text-white p-2 rounded-lg"
              >
                Add
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}