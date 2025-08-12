import type { Tour } from '../types/tour.types';

export const generateMockTours = (): Tour[] => [
  {
    id: '5c88fa8cf4afda39709c2951',
    name: 'The Forest Hiker',
    duration: 5,
    maxGroupSize: 25,
    difficulty: 'easy',
    ratingsAverage: 5,
    ratingsQuantity: 9,
    price: 397,
    summary: 'Breathtaking hike through the Canadian Banff National Park',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    imageCover: '/img/tours/tour-1-cover.jpg',
    startLocation: {
      type: 'Point',
      coordinates: [-115.570154, 51.178456],
      description: 'Banff, CAN',
      address: '224 Banff Ave, Banff, AB, Canada'
    },
    locations: [
      {
        id: '5c88fa8cf4afda39709c2954',
        description: 'Banff National Park',
        type: 'Point',
        coordinates: [-116.214531, 51.417611],
        day: 1
      },
      {
        id: '5c88fa8cf4afda39709c2953',
        description: 'Jasper National Park',
        type: 'Point',
        coordinates: [-118.076152, 52.875223],
        day: 3
      },
      {
        id: '5c88fa8cf4afda39709c2952',
        description: 'Glacier National Park of Canada',
        type: 'Point',
        coordinates: [-117.490309, 51.261937],
        day: 5
      }
    ],
    startDates: [
      '2026-04-25T09:00:00.000Z',
      '2026-07-20T09:00:00.000Z',
      '2026-10-05T09:00:00.000Z'
    ],
    slug: 'the-forest-hiker',
    images: ['tour-1-1.jpg', 'tour-1-2.jpg', 'tour-1-3.jpg'],
    guides: [
      {
        id: '5c8a22c62f8fb814b56fa18b',
        name: 'John Doe',
        email: 'john.doe@example.com',
        photo: '../../public/img/users/user-5.jpg',
        role: 'lead-guide'
      },
      {
        id: '5c8a23412f8fb814b56fa18c',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        photo: '../../public/img/users/user-2.jpg',
        role: 'guide'
      },
      {
        id: '5c8a1f4e2f8fb814b56fa185',
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        photo: '../../public/img/users/user-3.jpg',
        role: 'guide'
      }
    ],
    reviews: [
      {
        id: '1',
        rating: 4,
        review: 'Amazing experience! The Northern Lights were spectacular.',
        createdAt: '2024-01-15',
        user: {
          name: 'Sarah Johnson',
          photo: '../../public/img/users/user-6.jpg'
        }
      },
      {
        id: '2',
        rating: 4.8,
        review: 'Amazing experience! The Northern Lights were spectacular.',
        createdAt: '2024-01-15',
        user: {
          name: 'John Doe',
          photo: '../../public/img/users/user-2.jpg'
        }
      },
      {
        id: '3',
        rating: 4.5,
        review: 'Amazing experience! The Northern Lights were spectacular. I would highly recommend this tour to anyone looking for an unforgettable adventure.',
        createdAt: '2024-01-15',
        user: {
          name: 'Emily Johnson',
          photo: '../../public/img/users/user-7.jpg'
        }
      },
      {
        id: '4',
        rating: 4.6,
        review: 'Amazing experience! The Northern Lights were spectacular.',
        createdAt: '2024-01-15',
        user: {
          name: 'Michael Brown',
          photo: '../../public/img/users/user-8.jpg'
        }
      },
      {
        id: '5',
        rating: 3,
        review: 'The tour was good, but I expected more from the guides. They were knowledgeable but not very engaging.',
        createdAt: '2024-01-15',
        user: {
          name: 'Lisa White',
          photo: '../../public/img/users/user-7.jpg'
        }
      },
      {
        id: '6',
        rating: 4.7,
        review: 'The tour was well-organized and the guides were friendly, but I wish we had more time at each location.',
        createdAt: '2024-01-15',
        user: {
          name: 'David Wilson',
          photo: '../../public/img/users/user-9.jpg'
        }
      },
    ],
    createdAt: '2025-08-09T13:13:44.000Z',
  },
  {
    id: '5c88fa8cf4afda39709c2955',
    name: 'The Sea Explorer',
    duration: 7,
    maxGroupSize: 15,
    difficulty: 'medium',
    ratingsAverage: 4.8,
    ratingsQuantity: 6,
    price: 497,
    summary: 'Exploring the jaw-dropping US east coast by foot and by boat',
    description: 'Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nIrure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    imageCover: '/img/tours/tour-2-cover.jpg',
    startLocation: {
      type: 'Point',
      coordinates: [-80.185942, 25.774772],
      description: 'Miami, USA',
      address: '301 Biscayne Blvd, Miami, FL 33132, USA'
    },
    locations: [
      {
        id: '5c88fa8cf4afda39709c2959',
        description: 'Lummus Park Beach',
        type: 'Point',
        coordinates: [-80.128473, 25.781842],
        day: 1
      },
      {
        id: '5c88fa8cf4afda39709c2958',
        description: 'Islamorada',
        type: 'Point',
        coordinates: [-80.647885, 24.909047],
        day: 2
      },
      {
        id: '5c88fa8cf4afda39709c2957',
        description: 'Sombrero Beach',
        type: 'Point',
        coordinates: [-81.0784, 24.707496],
        day: 3
      },
      {
        id: '5c88fa8cf4afda39709c2956',
        description: 'West Key',
        type: 'Point',
        coordinates: [-81.768719, 24.552242],
        day: 5
      }
    ],
    startDates: [
      '2025-06-19T09:00:00.000Z',
      '2026-07-20T09:00:00.000Z',
      '2026-08-18T09:00:00.000Z'
    ],
    slug: 'the-sea-explorer',
    images: ['tour-2-1.jpg', 'tour-2-2.jpg', 'tour-2-3.jpg'],
    guides: [
      {
        id: '5c8a22c62f8fb814b56fa18b',
        name: 'John Doe',
        email: 'john.doe@example.com',
        photo: '../../public/img/users/user-5.jpg',
        role: 'lead-guide'
      },
      {
        id: '5c8a23412f8fb814b56fa18c',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        photo: '../../public/img/users/user-2.jpg',
        role: 'guide'
      },
      {
        id: '5c8a1f4e2f8fb814b56fa185',
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        photo: '../../public/img/users/user-3.jpg',
        role: 'guide'
      }
    ],
    createdAt: '2025-08-09T13:13:44.000Z',
  },
  {
    id: '5c88fa8cf4afda39709c295a',
    name: 'The Snow Adventurer',
    duration: 4,
    maxGroupSize: 10,
    difficulty: 'difficult',
    ratingsAverage: 4.5,
    ratingsQuantity: 6,
    price: 997,
    summary: 'Exciting adventure in the snow with snowboarding and skiing',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!',
    imageCover: '/img/tours/tour-3-cover.jpg', // Note: Ensure this image exists in your assets
    startLocation: {
      type: 'Point',
      coordinates: [-106.822318, 39.190872],
      description: 'Aspen, USA',
      address: '419 S Mill St, Aspen, CO 81611, USA'
    },
    locations: [
      {
        id: '5c88fa8cf4afda39709c295c',
        description: 'Aspen Highlands',
        type: 'Point',
        coordinates: [-106.855385, 39.182677],
        day: 1
      },
      {
        id: '5c88fa8cf4afda39709c295b',
        description: 'Beaver Creek',
        type: 'Point',
        coordinates: [-106.516623, 39.60499],
        day: 2
      }
    ],
    startDates: [
      '2026-01-05T10:00:00.000Z',
      '2026-02-12T10:00:00.000Z',
      '2026-04-06T10:00:00.000Z'
    ],
    slug: 'the-snow-adventurer',
    images: ['tour-3-1.jpg', 'tour-3-2.jpg', 'tour-3-3.jpg'],
    guides: [
      {
        id: '5c8a22c62f8fb814b56fa18b',
        name: 'John Doe',
        email: 'john.doe@example.com',
        photo: '../../public/img/users/user-5.jpg',
        role: 'lead-guide'
      },
      {
        id: '5c8a23412f8fb814b56fa18c',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        photo: '../../public/img/users/user-2.jpg',
        role: 'guide'
      },
      {
        id: '5c8a1f4e2f8fb814b56fa185',
        name: 'Emily Johnson',
        email: 'emily.johnson@example.com',
        photo: '../../public/img/users/user-3.jpg',
        role: 'guide'
      }
    ],
    createdAt: '2025-08-09T13:13:44.000Z',
  },
  {
    id: '5c88fa8cf4afda39709c2974',
    name: 'The Northern Lights',
    duration: 3,
    maxGroupSize: 12,
    difficulty: 'easy',
    ratingsAverage: 4.7,
    ratingsQuantity: 7,
    price: 1497,
    summary: 'Enjoy the Northern Lights in one of the best places in the world',
    description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum!\nDolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!',
    imageCover: '/img/tours/tour-9-cover.jpg',
    startLocation: {
      type: 'Point',
      coordinates: [-114.406097, 62.439943],
      description: 'Yellowknife, CAN',
      address: 'Yellowknife, NT X1A 2L2, Canada'
    },
    locations: [
      {
        id: '5c88fa8cf4afda39709c2975',
        description: 'Yellowknife',
        type: 'Point',
        coordinates: [-114.406097, 62.439943],
        day: 1
      }
    ],
    startDates: [
      '2025-12-16T10:00:00.000Z',
      '2026-01-16T10:00:00.000Z',
      '2026-12-12T10:00:00.000Z'
    ],
    slug: 'the-northern-lights',
    images: ['tour-9-1.jpg', 'tour-9-2.jpg', 'tour-9-3.jpg'],
    guides: [
      {
        id: '5c8a22c62f8fb814b56fa18b',
        name: 'John Doe',
        email: 'john.doe@example.com',
        photo: '../../public/img/users/user-5.jpg',
        role: 'lead-guide'
      },
      {
        id: '5c8a23412f8fb814b56fa18c',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        photo: '../../public/img/users/user-2.jpg',
        role: 'guide'
      },
    ],
    createdAt: '2025-08-09T13:13:44.000Z',
  },
];