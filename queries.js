// queries.js - MongoDB queries for PLP Bookstore assignment

const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://Edris-Abdella:6746@cluster0.vevsdxw.mongodb.net/PLP_bookstore?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'plp_bookstore';
const collectionName = 'books';

async function runQueries() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB server\n');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Task 2: Basic CRUD Operations
    console.log('=== TASK 2: BASIC CRUD OPERATIONS ===\n');

    // Find all books in a specific genre
    console.log('1. Books in "Fantasy" genre:');
    const fantasyBooks = await collection.find({ genre: 'Fantasy' }).toArray();
    fantasyBooks.forEach(book => {
      console.log(`   - "${book.title}" by ${book.author}`);
    });

    // Find books published after a certain year
    console.log('\n2. Books published after 1950:');
    const booksAfter1950 = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    booksAfter1950.forEach(book => {
      console.log(`   - "${book.title}" (${book.published_year})`);
    });

    // Find books by a specific author
    console.log('\n3. Books by George Orwell:');
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    orwellBooks.forEach(book => {
      console.log(`   - "${book.title}" (${book.published_year})`);
    });

    // Update the price of a specific book
    console.log('\n4. Updating price of "The Hobbit":');
    const updateResult = await collection.updateOne(
      { title: 'The Hobbit' },
      { $set: { price: 16.99 } }
    );
    console.log(`   Modified ${updateResult.modifiedCount} document(s)`);

    // Verify the update
    const updatedBook = await collection.findOne({ title: 'The Hobbit' });
    console.log(`   New price: $${updatedBook.price}`);

    // Delete a book by its title
    console.log('\n5. Deleting "Moby Dick":');
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(`   Deleted ${deleteResult.deletedCount} document(s)`);

    // Task 3: Advanced Queries
    console.log('\n=== TASK 3: ADVANCED QUERIES ===\n');

    // Find books that are both in stock and published after 2010
    console.log('1. Books in stock and published after 2010:');
    const inStockRecent = await collection.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log('   Result:', inStockRecent.length > 0 ? 
      inStockRecent.map(b => b.title).join(', ') : 'No books found');

    // Use projection to return only title, author, and price
    console.log('\n2. Books with projection (title, author, price only):');
    const projectedBooks = await collection.find(
      { genre: 'Fiction' },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).limit(3).toArray();
    console.log('   Projected results:', projectedBooks);

    // Implement sorting by price (ascending and descending)
    console.log('\n3. Books sorted by price (ascending):');
    const sortedAsc = await collection.find({})
      .sort({ price: 1 })
      .project({ title: 1, price: 1, _id: 0 })
      .limit(5)
      .toArray();
    sortedAsc.forEach(book => {
      console.log(`   - "${book.title}": $${book.price}`);
    });

    console.log('\n4. Books sorted by price (descending):');
    const sortedDesc = await collection.find({})
      .sort({ price: -1 })
      .project({ title: 1, price: 1, _id: 0 })
      .limit(5)
      .toArray();
    sortedDesc.forEach(book => {
      console.log(`   - "${book.title}": $${book.price}`);
    });

    // Implement pagination (5 books per page)
    console.log('\n5. Pagination - Page 1 (5 books):');
    const page1 = await collection.find({})
      .sort({ title: 1 })
      .limit(5)
      .project({ title: 1, author: 1, _id: 0 })
      .toArray();
    page1.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" by ${book.author}`);
    });

    console.log('\n6. Pagination - Page 2 (5 books):');
    const page2 = await collection.find({})
      .sort({ title: 1 })
      .skip(5)
      .limit(5)
      .project({ title: 1, author: 1, _id: 0 })
      .toArray();
    page2.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" by ${book.author}`);
    });

    // Task 4: Aggregation Pipeline
    console.log('\n=== TASK 4: AGGREGATION PIPELINE ===\n');

    // Calculate average price by genre
    console.log('1. Average price by genre:');
    const avgPriceByGenre = await collection.aggregate([
      {
        $group: {
          _id: '$genre',
          averagePrice: { $avg: '$price' },
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]).toArray();
    avgPriceByGenre.forEach(genre => {
      console.log(`   - ${genre._id}: $${genre.averagePrice.toFixed(2)} (${genre.bookCount} books)`);
    });

    // Find author with the most books
    console.log('\n2. Author with most books:');
    const authorMostBooks = await collection.aggregate([
      {
        $group: {
          _id: '$author',
          bookCount: { $sum: 1 }
        }
      },
      {
        $sort: { bookCount: -1 }
      },
      {
        $limit: 3
      }
    ]).toArray();
    authorMostBooks.forEach((author, index) => {
      console.log(`   ${index + 1}. ${author._id}: ${author.bookCount} books`);
    });

    // Group books by publication decade
    console.log('\n3. Books by publication decade:');
    const booksByDecade = await collection.aggregate([
      {
        $project: {
          title: 1,
          published_year: 1,
          decade: {
            $subtract: [
              '$published_year',
              { $mod: ['$published_year', 10] }
            ]
          }
        }
      },
      {
        $group: {
          _id: '$decade',
          bookCount: { $sum: 1 },
          books: { $push: '$title' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).toArray();
    booksByDecade.forEach(decade => {
      console.log(`   - ${decade._id}s: ${decade.bookCount} books`);
    });

    // Task 5: Indexing
    console.log('\n=== TASK 5: INDEXING ===\n');

    // Create index on title field
    console.log('1. Creating index on title field...');
    await collection.createIndex({ title: 1 });
    console.log('   Index created on title field');

    // Create compound index on author and published_year
    console.log('\n2. Creating compound index on author and published_year...');
    await collection.createIndex({ author: 1, published_year: 1 });
    console.log('   Compound index created on author and published_year');

    // Demonstrate performance improvement with explain()
    console.log('\n3. Performance comparison with explain():');
    
    // Without index (simulating by using a non-indexed field)
    console.log('   Query without index (using genre field):');
    const explainWithoutIndex = await collection.find(
      { genre: 'Fantasy' }
    ).explain('executionStats');
    console.log(`   Documents examined: ${explainWithoutIndex.executionStats.totalDocsExamined}`);
    console.log(`   Execution time: ${explainWithoutIndex.executionStats.executionTimeMillis}ms`);

    // With index
    console.log('\n   Query with index (using title field):');
    const explainWithIndex = await collection.find(
      { title: 'The Hobbit' }
    ).explain('executionStats');
    console.log(`   Documents examined: ${explainWithIndex.executionStats.totalDocsExamined}`);
    console.log(`   Execution time: ${explainWithIndex.executionStats.executionTimeMillis}ms`);

    // List all indexes
    console.log('\n4. Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(index.key)}`);
    });

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

// Run all queries
runQueries().catch(console.error);