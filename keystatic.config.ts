import { config, collection, singleton, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'digisphere-website/hindustan-developers',
  },

  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        subtitle: fields.text({ label: 'Subtitle', multiline: true }),
        propertyType: fields.text({ label: 'Property Type (e.g. Villa, Apartment)' }),
        location: fields.text({ label: 'Location (e.g. Assagao, North Goa)' }),
        priceLine: fields.text({
          label: 'Price Line (e.g. 2 & 3 BHK Apartments Starting from ₹1.05 Crore)',
        }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        overviewBody: fields.text({
          label: 'Project Overview Body',
          multiline: true,
        }),
        highlights: fields.array(fields.text({ label: 'Highlight' }), {
          label: 'Project Highlights',
          itemLabel: (props) => props.value || 'New highlight',
        }),
        settingBody: fields.text({
          label: 'The Setting Body ("Every View Tells a Story" paragraph)',
          multiline: true,
        }),
        lifestyleBody: fields.text({
          label: 'Lifestyle Body ("More Meaning in the Everyday" paragraph)',
          multiline: true,
        }),
        amenities: fields.array(fields.text({ label: 'Amenity' }), {
          label: 'Project Amenities',
          itemLabel: (props) => props.value || 'New amenity',
        }),
        apartmentFeatures: fields.array(fields.text({ label: 'Feature' }), {
          label: 'Apartment Features',
          itemLabel: (props) => props.value || 'New feature',
        }),
        connectivityIntro: fields.text({
          label: 'Connectivity Intro',
          multiline: true,
        }),
        connectivityPlaces: fields.array(
          fields.object({
            name: fields.text({ label: 'Place Name (e.g. Goa International Airport)' }),
            travelTime: fields.text({ label: 'Travel Time (e.g. 30 Minutes)' }),
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: 'Airport', value: 'airport' },
                { label: 'Train', value: 'train' },
                { label: 'Beach', value: 'beach' },
                { label: 'Shopping', value: 'shopping' },
                { label: 'City', value: 'city' },
              ],
              defaultValue: 'city',
            }),
          }),
          {
            label: 'Connectivity Places',
            itemLabel: (props) => props.fields.name.value || 'New place',
          }
        ),
        mapImage: fields.image({
          label: 'Connectivity Map Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        floorPlans: fields.array(
          fields.object({
            label: fields.text({ label: 'Tab Label (e.g. 2BHK)' }),
            image: fields.image({
              label: 'Floor Plan Image',
              directory: 'public/images/projects',
              publicPath: '/images/projects/',
            }),
          }),
          {
            label: 'Floor Plans',
            itemLabel: (props) => props.fields.label.value || 'New floor plan',
          }
        ),
        gallery: fields.array(
          fields.object({
            label: fields.text({ label: 'Category Label (e.g. Landscape Areas)' }),
            description: fields.text({ label: 'Short Description' }),
            images: fields.array(
              fields.image({
                label: 'Image',
                directory: 'public/images/projects',
                publicPath: '/images/projects/',
              }),
              {
                label: 'Images',
              }
            ),
          }),
          {
            label: 'Gallery Categories',
            itemLabel: (props) => props.fields.label.value || 'New category',
          }
        ),
        reraId: fields.text({ label: 'RERA Registration No. (optional)' }),
        ctaImage: fields.image({
          label: 'CTA Banner Background Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        sortOrder: fields.integer({ label: 'Sort Order', defaultValue: 1 }),
        details: fields.array(
          fields.object({
            key: fields.text({ label: 'Label (e.g. Beds, Price, Area)' }),
            value: fields.text({ label: 'Value (e.g. 3 BHK, ₹1.25 Cr)' }),
          }),
          {
            label: 'Project Details',
            description: 'Key-value pairs shown as amenity icons on the project card.',
            itemLabel: (props) =>
              props.fields.key.value
                ? `${props.fields.key.value}: ${props.fields.value.value}`
                : 'New detail',
          }
        ),
      },
    }),

    legacyProjects: collection({
      label: 'Legacy Projects',
      slugField: 'title',
      path: 'src/content/legacy-projects/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        location: fields.text({ label: 'Location (e.g. Anjuna, Goa)' }),
        client: fields.text({ label: 'Client (rendered as "Contracting work for X")' }),
        image: fields.image({
          label: 'Project Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        developer: fields.text({ label: 'Developer (e.g. Chowhan)' }),
        scopeOfWork: fields.text({ label: 'Scope Of Work (e.g. 9 months)' }),
        completionYear: fields.text({ label: 'Completion Year (e.g. 2025)' }),
        sortOrder: fields.integer({ label: 'Sort Order', defaultValue: 1 }),
      },
    }),
  },

  singletons: {
    featuredProject: singleton({
      label: 'Featured Project',
      path: 'src/content/featured-project/',
      format: { data: 'json' },
      schema: {
        projectSlug: fields.relationship({
          label: 'Featured Project',
          description: 'Select ONE project to feature in the homepage highlight section.',
          collection: 'projects',
        }),
      },
    }),
  },
});
