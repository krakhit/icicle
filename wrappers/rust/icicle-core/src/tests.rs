use crate::{
    curve::{Affine, Curve, Projective},
    field::Field,
    traits::{FieldConfig, FieldImpl, GenerateRandom, MontgomeryConvertible},
};
use icicle_runtime::{
    memory::{DeviceVec, HostSlice},
    stream::IcicleStream,
};

pub fn check_field_equality<F: FieldImpl>() {
    let left = F::zero();
    let right = F::one();
    assert_ne!(left, right);
    let left = F::from_bytes_le(&[1]);
    assert_eq!(left, right);
}

pub fn check_affine_projective_convert<C: Curve>() {
    let size = 1 << 10;
    let affine_points = C::generate_random_affine_points(size);
    let projective_points = C::generate_random_projective_points(size);
    for affine_point in affine_points {
        let projective_eqivalent: Projective<C> = affine_point.into();
        assert_eq!(affine_point, projective_eqivalent.into());
    }
    for projective_point in projective_points {
        let affine_eqivalent: Affine<C> = projective_point.into();
        assert_eq!(projective_point, affine_eqivalent.into());
    }
}

pub fn check_point_equality<const BASE_LIMBS: usize, F: FieldConfig, C>()
where
    C: Curve<BaseField = Field<BASE_LIMBS, F>>,
{
    let left = Projective::<C>::zero();
    let right = Projective::<C>::zero();
    assert_eq!(left, right);
    let right = Projective::<C>::from_limbs([0; BASE_LIMBS], [2; BASE_LIMBS], [0; BASE_LIMBS]);
    assert_eq!(left, right);
    let mut z = [0; BASE_LIMBS];
    z[0] = 2;
    let right = Projective::<C>::from_limbs([0; BASE_LIMBS], [4; BASE_LIMBS], z);
    assert_ne!(left, right);
    let left = Projective::<C>::from_limbs([0; BASE_LIMBS], [2; BASE_LIMBS], C::BaseField::one().into());
    assert_eq!(left, right);
}

pub fn check_field_convert_montgomery<F>()
where
    F: FieldImpl + MontgomeryConvertible,
    F::Config: GenerateRandom<F>,
{
    let mut stream = IcicleStream::create().unwrap();

    let size = 1 << 10;
    let scalars = F::Config::generate_random(size);

    let mut d_scalars = DeviceVec::device_malloc(size).unwrap();
    d_scalars
        .copy_from_host(HostSlice::from_slice(&scalars))
        .unwrap();

    F::to_mont(&mut d_scalars, &stream);
    F::from_mont(&mut d_scalars, &stream);

    let mut scalars_copy = vec![F::zero(); size];
    d_scalars
        .copy_to_host_async(HostSlice::from_mut_slice(&mut scalars_copy), &stream)
        .unwrap();
    stream
        .synchronize()
        .unwrap();
    stream
        .destroy()
        .unwrap();

    assert_eq!(scalars_copy, scalars);
}

pub fn check_points_convert_montgomery<C: Curve>()
where
    Affine<C>: MontgomeryConvertible,
    Projective<C>: MontgomeryConvertible,
{
    let size = 1 << 10;

    let affine_points = C::generate_random_affine_points(size);
    let mut d_affine = DeviceVec::device_malloc(size).unwrap();
    d_affine
        .copy_from_host(HostSlice::from_slice(&affine_points))
        .unwrap();

    Affine::<C>::to_mont(&mut d_affine, &IcicleStream::default())
        .wrap()
        .unwrap();
    Affine::<C>::from_mont(&mut d_affine, &IcicleStream::default())
        .wrap()
        .unwrap();

    let mut affine_copy = vec![Affine::<C>::zero(); size];
    d_affine
        .copy_to_host(HostSlice::from_mut_slice(&mut affine_copy))
        .unwrap();

    assert_eq!(affine_points, affine_copy);

    let proj_points = C::generate_random_projective_points(size);
    let mut d_proj = DeviceVec::device_malloc(size).unwrap();
    d_proj
        .copy_from_host(HostSlice::from_slice(&proj_points))
        .unwrap();

    Projective::<C>::to_mont(&mut d_proj, &IcicleStream::default())
        .wrap()
        .unwrap();
    Projective::<C>::from_mont(&mut d_proj, &IcicleStream::default())
        .wrap()
        .unwrap();

    let mut projective_copy = vec![Projective::<C>::zero(); size];
    d_proj
        .copy_to_host(HostSlice::from_mut_slice(&mut projective_copy))
        .unwrap();

    assert_eq!(proj_points, projective_copy);
}
