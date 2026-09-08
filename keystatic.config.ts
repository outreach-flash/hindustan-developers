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
        subtitle: fields.text({ label: 'Subtitle' }),
        propertyType: fields.text({ label: 'Property Type (e.g. Villa, Apartment)' }),
        location: fields.text({ label: 'Location (e.g. Assagao, North Goa)' }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
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
  },

  singletons: {
    featuredProject: singleton({
      label: 'Featured Project',
      path: 'src/content/featured-project',
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
